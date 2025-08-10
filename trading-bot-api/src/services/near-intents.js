"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearIntentsService = void 0;
var axios_1 = require("axios");
var NearIntentsService = /** @class */ (function () {
    function NearIntentsService(baseUrl) {
        if (baseUrl === void 0) { baseUrl = 'https://near-api-4kbh.onrender.com'; }
        this.baseUrl = baseUrl;
    }
    NearIntentsService.prototype.executeSwap = function (swapRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1, errorMessage;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 2, , 3]);
                        console.log('🔄 Executing swap via NEAR Intents API...');
                        console.log("   ".concat(swapRequest.amount, " ").concat(swapRequest.originSymbol, " (").concat(swapRequest.originBlockchain, ") \u2192 ").concat(swapRequest.destinationSymbol, " (").concat(swapRequest.destinationBlockchain, ")"));
                        return [4 /*yield*/, axios_1.default.post("".concat(this.baseUrl, "/api/swap"), swapRequest, {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                timeout: 30000, // 30 second timeout
                            })];
                    case 1:
                        response = _d.sent();
                        if (response.data.success) {
                            console.log('✅ Swap executed successfully');
                            console.log("   Transaction Hash: ".concat(response.data.depositTxHash || 'N/A'));
                            console.log("   Final Status: ".concat(((_a = response.data.finalStatus) === null || _a === void 0 ? void 0 : _a.status) || 'N/A'));
                        }
                        else {
                            console.error('❌ Swap failed:', response.data.error);
                        }
                        return [2 /*return*/, {
                                success: response.data.success,
                                data: response.data,
                                error: response.data.error
                            }];
                    case 2:
                        error_1 = _d.sent();
                        console.error('❌ NEAR Intents API error:', error_1);
                        if (axios_1.default.isAxiosError(error_1)) {
                            errorMessage = ((_c = (_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) || error_1.message;
                            return [2 /*return*/, {
                                    success: false,
                                    error: "API Error: ".concat(errorMessage)
                                }];
                        }
                        return [2 /*return*/, {
                                success: false,
                                error: error_1 instanceof Error ? error_1.message : 'Unknown error'
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NearIntentsService.prototype.getTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/api/tokens"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.tokens || response.data || []];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error fetching tokens:', error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NearIntentsService.prototype.getTokensByBlockchain = function (blockchain) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/api/tokens/").concat(blockchain))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.tokens || response.data || []];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Error fetching tokens for ".concat(blockchain, ":"), error_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NearIntentsService.prototype.getSupportedBlockchains = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/api/blockchains"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.blockchains || response.data || []];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error fetching supported blockchains:', error_4);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NearIntentsService.prototype.getTokenSymbols = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/api/symbols"))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.symbols || response.data || []];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error fetching token symbols:', error_5);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NearIntentsService.prototype.checkHealth = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(this.baseUrl, "/api/health"), {
                                timeout: 5000
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.status === 200];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Health check failed:', error_6);
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Helper method to validate swap request
    NearIntentsService.prototype.validateSwapRequest = function (swapRequest) {
        var errors = [];
        if (!swapRequest.senderAddress) {
            errors.push('Sender address is required');
        }
        if (!swapRequest.senderPrivateKey) {
            errors.push('Sender private key is required');
        }
        if (!swapRequest.recipientAddress) {
            errors.push('Recipient address is required');
        }
        if (!swapRequest.originSymbol) {
            errors.push('Origin token symbol is required');
        }
        if (!swapRequest.originBlockchain) {
            errors.push('Origin blockchain is required');
        }
        if (!swapRequest.destinationSymbol) {
            errors.push('Destination token symbol is required');
        }
        if (!swapRequest.destinationBlockchain) {
            errors.push('Destination blockchain is required');
        }
        if (!swapRequest.amount || isNaN(parseFloat(swapRequest.amount)) || parseFloat(swapRequest.amount) <= 0) {
            errors.push('Valid amount is required');
        }
        return errors;
    };
    // Method to estimate swap output (if API supports it)
    NearIntentsService.prototype.getSwapQuote = function (originSymbol, originBlockchain, destinationSymbol, destinationBlockchain, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // This would depend on if the NEAR Intents API has a quote endpoint
                    // For now, we'll return a placeholder
                    console.log("\uD83D\uDCAD Getting quote for ".concat(amount, " ").concat(originSymbol, " \u2192 ").concat(destinationSymbol));
                    // If the API had a quote endpoint, it would be something like:
                    // const response = await axios.post(`${this.baseUrl}/api/quote`, {
                    //   originSymbol,
                    //   originBlockchain,
                    //   destinationSymbol,
                    //   destinationBlockchain,
                    //   amount
                    // });
                    return [2 /*return*/, {
                            estimatedOutput: 'Quote endpoint not available',
                            exchangeRate: 'N/A',
                            fees: 'N/A'
                        }];
                }
                catch (error) {
                    console.error('Error getting swap quote:', error);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    // Method to check swap status by transaction hash
    NearIntentsService.prototype.getSwapStatus = function (txHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // This would depend on if the NEAR Intents API has a status endpoint
                    console.log("\uD83D\uDD0D Checking status for transaction: ".concat(txHash));
                    // Placeholder implementation
                    return [2 /*return*/, {
                            status: 'pending',
                            txHash: txHash,
                            timestamp: new Date().toISOString()
                        }];
                }
                catch (error) {
                    console.error('Error checking swap status:', error);
                    return [2 /*return*/, null];
                }
                return [2 /*return*/];
            });
        });
    };
    return NearIntentsService;
}());
exports.NearIntentsService = NearIntentsService;
