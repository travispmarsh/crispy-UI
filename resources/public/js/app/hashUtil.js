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
function module(R) {
  return {
    "generateNavigationHash": function (args) {
      var panel = args.panel,
          hashArguments = R.dissoc('panel', args),
          hashArgList = R.map(function (key) {
            return key + "_" + hashArguments[key];
          }, R.keys(hashArguments));
      return R.join(",", R.prepend(panel, hashArgList));
    },

    "parseNavigationHash": function (rawHash) {
      var hash = rawHash.substr(1).split(","),
          newData = R.fromPairs(R.map(R.partial(R.split, "_"), R.tail(hash)));

      return {panel: hash[0], data: newData};
    }
  };
}

define(["ramda"], module);