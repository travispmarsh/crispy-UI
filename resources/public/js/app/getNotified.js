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

function module($) {
  function submitNotification() {
    $("#notifyBtn").attr("disabled", true);

    var emailAddress = $("#email").val();
    $.ajax({
      method: "post",
      url: "/api/v1/getnotified",
      data: {email: emailAddress}
    }).done(function (result) {
      $("#notify").hide(0, function () {
        $("#notify-success").show(0);
      });
    }).fail(function () {
      $("#notifyBtn").attr("disabled", false);
      alert("Sorry, but we were unable to complete your request. Please try again later.");
    });
    return false;
  }

  return {
    "load": function () {
      $("#notify-form").validate({
        submitHandler: submitNotification,
        rules: {emailAddress: {required: true, email: true}}
      });
    }
  };
}

define(["jquery", "jquery.validate"], module);
