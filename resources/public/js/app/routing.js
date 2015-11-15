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

function module($, R, hashUtil, v) {
  var panels = ".core-panel",
      data = {},
      postRoute = {};

  /**
   * Display a different panel. Hides everything referred to by the global
   * panels field and shows the thing with the ID of "{newPanel}-panel".
   * Also activates appropriate navigation elements by hiding everything
   * with the "active" class and attaching the "active" class to the things
   * with a class called "{newPanel}-nav" (could be a whole hierarchy in
   * the case of a dropdown menu).
   *
   * If there is a postRoute function, that will be called last.
   *
   * @param newPanel Panel to display, along with its related navigation
   *                 elements.
   */
  function changePanel(newPanel) {
    var panelSelector = "#" + newPanel + "-panel";
    $("html, body").scrollTop(0);

    v.hideThenShow(panels, panelSelector, function () {
      $(panelSelector + " .first-field").focus();
      $(".active").removeClass("active");
      $("." + newPanel + "-nav").addClass("active");

      if (postRoute[newPanel]) {
        postRoute[newPanel]();
      }
    });
  }

  /**
   * Navigate to a different panel of the application.
   *
   * This function is very special. The arguments you pass in must be of the
   * following format:
   *
   * {panel: "some div ID to display", arg1: arg1Value, arg2: arg2Value,
     *  ... argn: argnValue}
   *
   * If the only argument in the collection is a panel, then we will simply
   * replace the hash with that argument. If not, we will also append the
   * arguments to the hash with the following format:
   *
   * window.location.hash=panel,arg1|arg1Value,arg2|arg2Value,argn|argnValue
   *
   * @param args
   * @returns boolean -- always false so as to avoid form submission
   */
  function navigate(args) {
    window.location.hash = hashUtil.generateNavigationHash(args);
    return false;
  }

  /**
   * Purge all the keys from an object. This mutates the object.
   * @param o Object to purge all the keys from.
   */
  function purge(o) {
    R.forEach(function (key) {
      delete o[key];
    }, Object.keys(o));
  }

  /**
   * Take all the data from src and put it into the dest. This mutates the
   * dest object.
   * @param src Source of data.
   * @param dest Recipient of data.
   */
  function copy(src, dest) {
    R.forEach(function (key) {
      dest[key] = src[key];
    }, R.keys(src));
  }

  /**
   * Register an event handler to fire after routing has occurred.
   * @param panel The panel we transitioned into.
   * @param f Function to execute after routing.
   */
  function registerPostRoute(panel, f) {
    if (postRoute[panel]) {
      throw "Route already registered for: " + panel;
    } else {
      postRoute[panel] = f;
    }
  }

  $(window).hashchange(function () {
    var parsed = hashUtil.parseNavigationHash(window.location.hash);

    purge(data);
    copy(parsed.data, data);

    if (parsed.panel !== "") {
      changePanel(parsed.panel);
    } else {
      changePanel("home");
    }
  });

  return {
    "navigate": navigate,
    "triggerNavigation": function () {
      $(window).hashchange();
    },
    "data": data,
    "registerPostRoute": registerPostRoute
  };
}

define(["jquery", "ramda", "app/hashUtil", "app/viewFn",
  "jquery.ba-hashchange.min"], module);