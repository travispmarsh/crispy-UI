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

(defproject crispy-tatertot "0.1.0-SNAPSHOT"
  :description
  "A simple application for facilitating confidential, motivating conversations"

  :min-lein-version "2.0.0"
  :dependencies [[ch.qos.logback/logback-classic "1.1.3"]
                 [clj-time "0.9.0"] ; required due to bug in lein-ring
                 [com.zaxxer/HikariCP "2.4.1"]
                 [honeysql "0.6.2"]
                 [http-kit "2.1.18"]
                 [metosin/compojure-api "0.22.0"]
                 [mysql/mysql-connector-java "5.1.36"]
                 [org.clojure/clojure "1.6.0"]
                 [org.clojure/java.jdbc "0.4.2"]
                 [org.clojure/tools.logging "0.3.1"]
                 [org.flywaydb/flyway-core "3.2.1"]
                 [org.julienxx/clj-slack "0.5.1"]]
  :ring {:handler crispy-tatertot.handler/app}
  :uberjar-name "server.jar"
  :profiles {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                                  [speclj "3.3.1"]]
                   :plugins [[lein-ring "0.9.6"]
                             [speclj "3.3.1"]]}
             :uberjar {:aot :all}}
  :test-paths ["spec"])
