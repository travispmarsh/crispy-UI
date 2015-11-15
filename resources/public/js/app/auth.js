/*
 * Copyright (c) 2015, Courage Labs, LLC.
 *
 * This file is part of Crispy Tatertot.
 *
 * Crispy Tatertot is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Crispy Tatertot is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Crispy Tatertot.  If not, see <http://www.gnu.org/licenses/>.
 */

function module($, navigator) {
  var currentUser = null,
      sessionUrl = '/api/v1/session';

  function load(loginCallback, logoutCallback) {
    function onLogout() {
      currentUser = null;
      logoutCallback();
    }

    $.ajax({url: sessionUrl}).always(function (data, status, err) {
      if (status === "success") {
        onLogin(data);
      } else if (data.status !== 404) {
        console.log("Error connecting", {data: data, status: status, err: err});
        alert("Admin API is currently down.");
        return false;
      }

      navigator.id.watch({
        loggedInUser: currentUser,
        onlogin: function (assertion) {
          function onLogin(user) {
            this.loggedInUser = currentUser = user;
            loginCallback(user);
          }

          $.ajax({
            /* <-- This example uses jQuery, but you can use whatever you'd like */
            type: 'POST',
            url: sessionUrl, // This is a URL on your website.
            data: {assertion: assertion},
            success: function (res, status, xhr) {
              loginCallback(res);
            },
            error: function (xhr, status, err) {
              navigator.id.logout();
              alert("Login failure: " + err);
            }
          });
        },
        onlogout: function () {
          // A user has logged out! Here you need to:
          // Tear down the user's session by redirecting the user or making a call to your backend.
          // Also, make sure loggedInUser will get set to null on the next page load.
          // (That's a literal JavaScript null. Not false, 0, or undefined. null.)
          $.ajax({
            type: 'DELETE',
            url: sessionUrl, // This is a URL on your website.
            success: function (res, status, xhr) {
              onLogout();
            },
            error: function (xhr, status, err) {
              alert("Logout failure: " + err);
            }
          });
        }
      });

      if (data.status === 404) {
        onLogout();
      }
    });
  }

  return {
    "load": load,
    "login": function () {
      navigator.id.request();
    },
    "logout": function () {
      navigator.id.logout();
    }
  };
}

define(["jquery", "persona"], module);
