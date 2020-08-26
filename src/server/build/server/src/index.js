"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var port = 4000;
app.use(express_1.default.static(__dirname + '/../../client/build'));
app.get('/', function (req, res) {
    return res.sendFile(__dirname + '/../../client/build/index.html');
});
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
