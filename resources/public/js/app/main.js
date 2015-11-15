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

function main($, getNotified, auth) {
  function onLogout() {
    $('#logout-btn').hide(0);
    $('#login-btn').show(0);
    $("#email").val('');
  }

  function onLogin(currentUser) {
    $('#logout-btn').show(0);
    $('#login-btn').hide(0);
    $("#email").val(currentUser);
  }

  getNotified.load();

  auth.load(onLogin, onLogout);

  $('#login-btn').click(function () {
    auth.login();
  });

  $('#logout-btn').click(function () {
    auth.logout();
  });
}

require(["jquery", "app/getNotified", "app/auth"], main);