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
  var times = 0;
  $('#notify-form').submit(function (e) {
    var emailAddress = $("#email").val();
    $.ajax({
      method: "post",
      url: "/api/v1/getnotified",
      data: {email: emailAddress}
    }).done(function(result) {
      console.log("done", result);
    });
    return false;
  });
  console.log("hi");
});