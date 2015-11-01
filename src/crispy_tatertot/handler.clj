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

(ns crispy-tatertot.handler
  (:require [compojure.api.sweet :refer :all]
            [compojure.handler :refer [site]]
            [compojure.route :as r]
            [org.httpkit.server :as srv]
            [ring.util.http-response :refer :all]
            [clj-slack.chat :as chat])
  (:gen-class))

(defn env [key]
  (let [val (System/getenv key)]
    (if-not val (throw (IllegalStateException.
                         (format "Environment variable missing: %s" key))))
    val))

(def connection {:api-url "https://slack.com/api"
                 :token   (env "CRISPY_SLACK_TOKEN")})

(def channel (env "CRISPY_SLACK_CHANNEL"))

(defn wrap-dir-index [handler]
  (fn [req]
    (handler
      (update-in req [:uri]
                 #(if (= "/" %) "/index.html" %)))))

(defapi app
  (swagger-ui
    "/swagger-ui"
    :swagger-docs "/swagger-docs")
  (swagger-docs
    "/swagger-docs"
    {:info {:title       "Crispy Tater Tots' API"
            :description "Secure coaching communications over the internet"}
     :tags [{}]})

  (middlewares [wrap-dir-index]
    (context* "/api/v1" []
      :tags ["APIs"]

      (POST* "/getnotified" []
        :return String
        :form-params [email :- String]
        (chat/post-message connection channel
                           "New Signup!"
                           {:username    "tater-bot"
                            :icon_emoji  ":envelope:"
                            :attachments [{:text email}]})
        (ok "Success")))
    (r/resources "/")))

(defn -main [& [port]]
  (let [port (Integer/parseInt (env "PORT"))]
    (srv/run-server (site #'app) {:port port})))