;
; Copyright (c) 2015, Courage Labs, LLC.
;
; This file is part of Crispy Tatertot.
;
; Crispy Tatertot is free software: you can redistribute it and/or modify
; it under the terms of the GNU Affero General Public License as published by
; the Free Software Foundation, either version 3 of the License, or
; (at your option) any later version.
;
; Crispy Tatertot is distributed in the hope that it will be useful,
; but WITHOUT ANY WARRANTY; without even the implied warranty of
; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
; GNU Affero General Public License for more details.
;
; You should have received a copy of the GNU Affero General Public License
; along with Crispy Tatertot.  If not, see <http://www.gnu.org/licenses/>.
;

(ns crispy-tatertot.conversation
  (:require [clojure.java.jdbc :as jdbc]
            [clojure.tools.logging :as log]
            [honeysql.core :as sql]
            [honeysql.helpers :as h]
            [schema.core :as s])
  (:import (java.io ByteArrayInputStream)))

(s/defschema User {:email_address       String
                   (s/optional-key :id) s/Int})

(s/defschema Conversation {:id s/Int})

(s/defschema Message {:sender String :message String :level String})

(defn fetch-user# [conn email-address]
  (let [query (-> (h/select [:id "id"] [:email_address "email_address"])
                  (h/from :users)
                  (h/where [:= :email_address email-address])
                  sql/format)
        result (jdbc/query conn query)]
    (if (= 1 (count result))
      (->> result
           first
           (filter second)
           (into {})))))

(defn- fetch-last-insert-id [conn]
  (-> ["SELECT LAST_INSERT_ID() AS ID"]
      (#(jdbc/query conn % :row-fn :id))
      first))

(defn ensure-user#
  "Ensures that a user with the given email address exists."
  [conn user]
  (s/validate User user)
  (let [email-address (:email_address user)]
    (let [existing-user (fetch-user# conn email-address)]
      (if-not existing-user
        (do
          (log/infof "New user: %s" user)
          (jdbc/execute! conn (-> (h/insert-into :users)
                                  (h/values [{:email_address email-address}])
                                  sql/format))
          (fetch-user# conn email-address))
        existing-user))))

(defn- add-participant-raw [conn user conversation level]
  (s/validate User user)
  (s/validate Conversation conversation)
  (jdbc/execute! conn
                 ["INSERT INTO CONVERSATION_PARTICIPANTS
                   (user_id, conversation_id, level_id)
                   (SELECT ?, ?, id FROM PARTICIPATION_LEVELS
                    WHERE NAME = ?)"
                  (:id user) (:id conversation) level])
  conversation)

(defn create-conversation [ds owner-email]
  (jdbc/with-db-transaction [conn {:datasource ds}]
    (let [user (ensure-user# conn {:email_address owner-email})
          _ (jdbc/execute! conn ["INSERT INTO CONVERSATIONS VALUES ()"])
          conversation {:id (fetch-last-insert-id conn)}]
      (add-participant-raw conn user conversation "owner"))))

(defn add-participant [conversation ds participant-email]
  (jdbc/with-db-transaction [conn {:datasource ds}]
    (let [user (ensure-user# conn {:email_address participant-email})]
      (add-participant-raw conn user conversation "participant"))))

(defn send-message [conversation ds participant-email message]
  (s/validate Conversation conversation)
  (jdbc/with-db-transaction [conn {:datasource ds}]
    (let [participant-query (-> (h/select [:cp.id "id"])
                                (h/from [:conversation_participants :cp])
                                (h/join :users [:= :cp.user_id :users.id])
                                (h/where
                                  [:and
                                   [:= :cp.conversation_id (:id conversation)]
                                   [:= :users.email_address participant-email]])
                                sql/format)
          participant-id (first (jdbc/query conn participant-query :row-fn :id))
          insert-stmt (-> (h/insert-into :conversation_messages)
                          (h/values [{:cp_id   participant-id
                                      :message (ByteArrayInputStream.
                                                 (.getBytes message))}])
                          sql/format)]
      (jdbc/execute! conn insert-stmt)
      conversation)))

(def array-of-bytes-type (Class/forName "[B"))

(defn choose-binary-stream
  "MySQL returns byte arrays. H2 returns JdbcBlob objects."
  [cell]
  (let [type (type cell)]
    (if (= array-of-bytes-type type)
      (ByteArrayInputStream. cell)
      (.getBinaryStream cell))))

(defn list-messages [conversation ds]
  (jdbc/with-db-connection [conn {:datasource ds}]
    (let [msg-query (-> (h/select [:users.email_address "sender"]
                                  [:msg.message "message"]
                                  [:pl.name "level"])
                        (h/from [:conversation_messages :msg])
                        (h/join [:conversation_participants :cp]
                                [:= :cp.id :msg.cp_id]

                                :users [:= :users.id :cp.user_id]

                                [:participation_levels :pl]
                                [:= :pl.id :cp.level_id])
                        (h/where
                          [:= :cp.conversation_id (:id conversation)])
                        sql/format)]
      (map #(update-in % [:message] (comp slurp choose-binary-stream))
           (jdbc/query conn msg-query)))))