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

function main($, R, v, getNotified, auth) {
  var emailSelector = "#email";

  function authView() {
    var logoutBtnSelector = "#logout-btn",
        loginBtnSelector = "#login-btn";

    auth.load({
      login: function (currentUser) {
        v.hideThenShow(loginBtnSelector, logoutBtnSelector,
            R.partial(v.setValue, "#email", currentUser));
      },
      logout: R.partial(v.hideThenShow, logoutBtnSelector,
          loginBtnSelector, R.partial(v.setValue, emailSelector, '')),
      fail: v.critFail
    });

    v.onClick(loginBtnSelector, R.partial(auth.login));
    v.onClick(logoutBtnSelector,
        v.confirmed("Are you sure you want to log out?",
            R.partial(auth.logout)));
  }

  function notifyView() {
    var notifyBtnSelector = "#notifyBtn";

    $("#notify-form").validate({
      submitHandler: R.partial(getNotified.submitNotification,
          {
            fetchEmail: R.partial(v.getValue, emailSelector),
            started: R.partial(v.disabled, notifyBtnSelector, true),
            success: R.partial(v.hideThenShow, "#notify", "#notify-success"),
            failed: R.partial(v.critFailed("Sorry, but we were unable to " +
                "complete your request. Please try again later."),
                R.partial(v.disabled, notifyBtnSelector, false))
          }),
      rules: {emailAddress: {required: true, email: true}}
    });
  }

  authView();
  notifyView();
}

require(["jquery", "ramda", "app/viewFn", "app/getNotified", "app/auth"], main);