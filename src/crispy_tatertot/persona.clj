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

; Source:
; https://github.com/osbert/persona-kit/blob/master/src/persona_kit/core.clj
; @ 23c1f5ffd758d85e4dd1ac9e4126c910258a6a2b

(ns crispy-tatertot.persona
  (:require [clojure.data.json :as j]
            [clj-http.client :as http]))

(defn verify-assertion
  "Return the raw verification response as a map."
  [assertion audience]
  (if-let [http-response (http/post "https://verifier.login.persona.org/verify"
                                    {:form-params {:assertion assertion
                                                   :audience  audience}})]
    (let [verification-response (j/read-json (:body http-response))]
      (if (= 200 (:status http-response))
        verification-response))
    {:status "HTTP POST returned nil/false"}))

(defn valid?
  "Return true if the verification response confirms this user's identity."
  [verification-response]
  (= "okay" (:status verification-response)))