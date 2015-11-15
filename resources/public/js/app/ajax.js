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


function module($, R) {

  /**
   * Reducing $.ajax boilerplate.
   *
   * @param type Argument to "type" arg
   * @param url Argument to "url" arg
   * @param args Other args
   */
  function ajax(type, url, args) {
    return $.ajax(R.merge({type: type, url: url}, args));
  }

  return {
    "post": R.partial(ajax, "POST"),
    "get": R.partial(ajax, "GET"),
    "delete": R.partial(ajax, "DELETE")
  };
}

define(["jquery", "ramda"], module);