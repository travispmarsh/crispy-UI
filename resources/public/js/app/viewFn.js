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

/*
 * A set of functions for manipulating our user interface.
 */
function module($, R) {
  function hideThenShow(selectorToHide, selectorToShow, fnToRun) {
    return $(selectorToHide).hide(0, function () {
      $(selectorToShow).show(0, fnToRun);
    });
  }

  function getValue(selector) {
    return $(selector).val();
  }

  function setValue(selector, newValue) {
    return $(selector).val(newValue);
  }

  function setAttr(attr, selector, newValue) {
    return $(selector).attr(attr, newValue);
  }

  function confirmed(msg, fn) {
    return function () {
      if (confirm(msg)) {
        return fn();
      }
    };
  }

  function critFail(msg) {
    alert(msg);
  }

  function critFailed(msg, fn) {
    return function () {
      critFail(msg);
      if (fn) {
        fn();
      }
    }
  }

  function onClick(selector, fn) {
    return $(selector).click(fn);
  }

  return {
    "disabled": R.partial(setAttr, "disabled"),
    "hideThenShow": hideThenShow,
    "getValue": getValue,
    "setValue": setValue,
    "setAttr": setAttr,
    "onClick": onClick,
    "critFail": critFail,
    "confirmed": confirmed,
    "critFailed": critFailed
  };
}

define(["jquery", "ramda"], module);