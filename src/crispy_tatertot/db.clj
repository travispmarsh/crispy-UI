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

(ns crispy-tatertot.db
  (:import (com.zaxxer.hikari HikariConfig HikariDataSource)
           (org.flywaydb.core Flyway)))

(defn- migrate [data-source]
  (doto (Flyway.) (.setDataSource data-source) (.migrate)) data-source)

(defn make-db-datasource
  "Create a new database connection pool."
  ([db-url db-username db-password]
   (make-db-datasource db-url db-username db-password 15000))

  ([db-url db-username db-password conn-timeout]
   (migrate (HikariDataSource. (doto (HikariConfig.)
                                 (.setConnectionTimeout conn-timeout)
                                 (.setJdbcUrl db-url)
                                 (.setUsername db-username)
                                 (.setPassword db-password))))))
