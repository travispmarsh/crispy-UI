; Copyright © 2013 Osbert Feng
;
; Distributed under the Eclipse Public License, the same as Clojure.
;
; Source:
; https://github.com/osbert/persona-kit/blob/master/src/persona_kit/core.clj
; @ 23c1f5ffd758d85e4dd1ac9e4126c910258a6a2b

(ns persona-kit.persona
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