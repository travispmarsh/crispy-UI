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

$(document).ready(function () {
  var currentUser = null,
      sessionUrl = '/api/v1/session';

  $('#notify-form').submit(function (e) {
    $("#notifyBtn").attr("disabled", true);

    var emailAddress = $("#email").val();
    $.ajax({
      method: "post",
      url: "/api/v1/getnotified",
      data: {email: emailAddress}
    }).done(function(result) {
      $("#notify").hide(0, function() {
        $("#notify-success").show(0);
      });
    }).fail(function() {
      $("#notifyBtn").attr("disabled", false);
      alert("Sorry, but we were unable to complete your request. Please try again later.");
    });
    return false;
  });

  function logout() {
    $('#logout-btn').hide(0);
    $('#login-btn').show(0);
    currentUser = null;
    $("#email").val('');
  }

  function login(data) {
    $('#logout-btn').show(0);
    $('#login-btn').hide(0);
    currentUser = data;
    $("#email").val(currentUser);
  }

  $.ajax({url: sessionUrl}).always(function (data, status, err) {
    if (status === "success") {
      login(data);
    } else if (data.status !== 404) {
      console.log("Error connecting", {data: data, status: status, err: err});
      alert("Admin API is currently down.");
      return false;
    }

    $('#login-btn').click(function () {
      navigator.id.request();
    });

    $('#logout-btn').click(function () {
      navigator.id.logout();
    });

    navigator.id.watch({
      loggedInUser: currentUser,
      onlogin: function (assertion) {
        // A user has logged in! Here you need to:
        // 1. Send the assertion to your backend for verification and to create a session.
        // 2. Update your UI.
        $.ajax({
          /* <-- This example uses jQuery, but you can use whatever you'd like */
          type: 'POST',
          url: sessionUrl, // This is a URL on your website.
          data: {assertion: assertion},
          success: function (res, status, xhr) {
            login(res);
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
            logout();
          },
          error: function (xhr, status, err) {
            alert("Logout failure: " + err);
          }
        });
      }
    });

    if (data.status === 404) {
      logout();
    }

  });
});