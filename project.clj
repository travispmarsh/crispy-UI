;
; Copyright (c) 2015, Courage Labs, LLC.
;
; This file is part of Crispy Tatertots.
;
; Crispy Tatertots is free software: you can redistribute it and/or modify
; it under the terms of the GNU Affero General Public License as published by
; the Free Software Foundation, either version 3 of the License, or
; (at your option) any later version.
;
; Crispy Tatertots is distributed in the hope that it will be useful,
; but WITHOUT ANY WARRANTY; without even the implied warranty of
; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
; GNU Affero General Public License for more details.
;
; You should have received a copy of the GNU Affero General Public License
; along with Crispy Tatertots.  If not, see <http://www.gnu.org/licenses/>.
;

(defproject crispy-tatertot "0.1.0-SNAPSHOT"
  :description
  "A simple application for facilitating confidential, motivating conversations"

  :min-lein-version "2.0.0"
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [clj-time "0.9.0"] ; required due to bug in lein-ring
                 [http-kit "2.1.18"]
                 [metosin/compojure-api "0.22.0"]
                 [org.julienxx/clj-slack "0.5.1"]]
  :ring {:handler crispy-tatertot.handler/app}
  :uberjar-name "server.jar"
  :profiles {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]]
                   :plugins [[lein-ring "0.9.6"]]}
             :uberjar {:aot :all}})
