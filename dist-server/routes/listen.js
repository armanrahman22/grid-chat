"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listenRouter = void 0;

const express = require("express");

const {
  ioServer
} = require("../helpers/socketHelper");

const {
  EventHubConsumerClient,
  earliestEventPosition
} = require("@azure/event-hubs");

const listenRouter = express.Router();
/* Default listen route */

exports.listenRouter = listenRouter;
listenRouter.post("/", async (req, res, next) => {});

function emitNotification(subscriptionId, data) {
  ioServer.to(subscriptionId).emit("notification_received", data);
}