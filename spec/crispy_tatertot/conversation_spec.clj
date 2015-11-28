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

(ns crispy-tatertot.conversation-spec
  (:require [clojure.java.jdbc :as jdbc]
            [crispy-tatertot.db :as db]
            [crispy-tatertot.conversation :as conv]
            [speclj.core :refer :all]))

(describe "Conversations"
  (with-all datasource
    (db/make-db-datasource "jdbc:h2:mem:test" "" ""))
  (after-all (jdbc/execute! {:datasource @datasource} ["drop all objects"]))

  (describe "Simple conversation"
    (with-all owner-email "test@place.com")
    (with-all owner-msg "Hi there")
    (with-all guest-email "coach@elsewhere.net")
    (with-all guest-msg "Why hello!")

    (with-all conversation
          (-> (conv/create-conversation @datasource @owner-email)
              (conv/add-participant @datasource @guest-email)
              (conv/send-message @datasource @owner-email @owner-msg)
              (conv/send-message @datasource @guest-email @guest-msg)))

    (it "Shows the whole conversation to each participant"
      (should= [{:sender @owner-email :message @owner-msg :level "owner"}
                {:sender @guest-email :message @guest-msg :level "participant"}]
               (conv/list-messages @conversation @datasource)))

    (describe "Second conversation"
      (with-all owner-email2 "something@place.com")
      (with-all owner-msg2 "Yo")
      (with-all guest-email2 "gentleman@elsewhere.net")
      (with-all guest-msg2 "Sup?")

      (with-all conversation2
            (-> (conv/create-conversation @datasource @owner-email2)
                (conv/add-participant @datasource @guest-email2)
                (conv/send-message @datasource @owner-email2 @owner-msg2)
                (conv/send-message @datasource @guest-email2 @guest-msg2)))

      (it "Shows the whole conversation to each participant"
        (should= [{:sender @owner-email2 :message @owner-msg2
                   :level  "owner"}

                  {:sender @guest-email2 :message @guest-msg2
                   :level  "participant"}]
                 (conv/list-messages @conversation2 @datasource)))

      (describe "Showing conversations"
        (it "Should get a list of a user's conversations")
        (it "Should not be able to see conversation contents directly")))))