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

function module($, navigator, a) {
  var currentUser = null,
      sessionUrl = '/api/v1/session';

  function load(args) {
    function onLogin(user) {
      currentUser = user;
      args.login(user);
    }

    function onLogout() {
      currentUser = null;
      args.logout();
    }

    a.get(sessionUrl).always(function (result, status, err) {
      if (status === "success") {
        onLogin(result);
      } else if (result.status !== 404) {
        console.log("Error connecting",
            {result: result, status: status, err: err});
        args.fail("Server connection failed. Please try again later.");
        return false;
      }

      navigator.id.watch({
        loggedInUser: currentUser,
        onlogin: function (assertion) {
          a.post(sessionUrl, {
            data: {assertion: assertion},
            success: function (res, status, xhr) {
              onLogin(res);
              this.loggedInUser = res;
            },
            error: function (xhr, status, err) {
              navigator.id.logout();
              args.fail("Unable to login. Please try again later.");
            }
          });
        },
        onlogout: function () {
          a.delete(sessionUrl, {
            success: function (res, status, xhr) {
              onLogout();
            },
            error: function (xhr, status, err) {
              args.fail("Unable to logout. Please try again later.");
            }
          });
        }
      });

      if (result.status === 404) {
        onLogout();
      }
    });
  }

  return {
    "load": load,
    "login": function () {
      navigator.id.request();
      return false;
    },
    "logout": function () {
      navigator.id.logout();
      return false;
    }
  };
}

define(["jquery", "persona", "app/ajax"], module);
