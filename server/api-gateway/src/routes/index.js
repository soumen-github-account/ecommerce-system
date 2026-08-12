
import { Router } from "express";

import proxyRequest from "../proxy/proxyRequest.js";

const router = Router();

router.all("/auth/*", (req, res) => {
    proxyRequest(req, res, "auth");
});

router.all("/users/*", (req, res) => {
    proxyRequest(req, res, "user");
});

router.all("/sellers/*", (req, res) => {
    proxyRequest(req, res, "seller");
});

router.all("/products/*", (req, res) => {
    proxyRequest(req, res, "product");
});


router.all("/orders/*", (req, res) => {
    proxyRequest(req, res, "order");
});

router.all("/payments/*", (req, res) => {
    proxyRequest(req, res, "payment");
});


export default router;