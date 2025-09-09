"use strict";

const { Contract } = require("fabric-contract-api");

class TouristSafetyContract extends Contract {
  async InitLedger(ctx) {
    return "OK";
  }

  async registerTourist(ctx, touristId, touristJson) {
    if (!touristId) throw new Error("touristId required");
    if (!touristJson) throw new Error("tourist payload required");
    const key = this._touristKey(touristId);
    const exists = await this._exists(ctx, key);
    if (exists) throw new Error(`Tourist ${touristId} already registered`);
    let data;
    try { data = JSON.parse(touristJson); } catch (e) { throw new Error("touristJson must be valid JSON"); }
    data._type = "tourist";
    data.id = touristId;
    data.touristId = touristId;
    data.createdAt = new Date().toISOString();
    data.updatedAt = data.createdAt;
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(data)));
    return JSON.stringify({ ok: true, touristId });
  }

  async createSOSAlert(ctx, alertId, alertJson) {
    if (!alertId) throw new Error("alertId required");
    if (!alertJson) throw new Error("alert payload required");
    const key = this._alertKey(alertId);
    const exists = await this._exists(ctx, key);
    if (exists) throw new Error(`Alert ${alertId} already exists`);
    let data;
    try { data = JSON.parse(alertJson); } catch (e) { throw new Error("alertJson must be valid JSON"); }
    data._type = "sos_alert";
    data.id = alertId;
    data.alertId = alertId;
    data.createdAt = new Date().toISOString();
    data.updatedAt = data.createdAt;
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(data)));
    return JSON.stringify({ ok: true, alertId });
  }

  async generateEFIR(ctx, efirId, efirJson) {
    if (!efirId) throw new Error("efirId required");
    if (!efirJson) throw new Error("efir payload required");
    const key = this._efirKey(efirId);
    const exists = await this._exists(ctx, key);
    if (exists) throw new Error(`EFIR ${efirId} already exists`);
    let data;
    try { data = JSON.parse(efirJson); } catch (e) { throw new Error("efirJson must be valid JSON"); }
    data._type = "efir";
    data.id = efirId;
    data.efirId = efirId;
    data.createdAt = new Date().toISOString();
    data.updatedAt = data.createdAt;
    await ctx.stub.putState(key, Buffer.from(JSON.stringify(data)));
    return JSON.stringify({ ok: true, efirId });
  }

  async readTourist(ctx, touristId) {
    const key = this._touristKey(touristId);
    const buf = await ctx.stub.getState(key);
    if (!buf || buf.length === 0) throw new Error(`Tourist ${touristId} not found`);
    return buf.toString();
  }

  async getTourist(ctx, touristId) {
    return this.readTourist(ctx, touristId);
  }

  async readSOSAlert(ctx, alertId) {
    const key = this._alertKey(alertId);
    const buf = await ctx.stub.getState(key);
    if (!buf || buf.length === 0) throw new Error(`Alert ${alertId} not found`);
    return buf.toString();
  }

  async readEFIR(ctx, efirId) {
    const key = this._efirKey(efirId);
    const buf = await ctx.stub.getState(key);
    if (!buf || buf.length === 0) throw new Error(`EFIR ${efirId} not found`);
    return buf.toString();
  }

  async getAllTourists(ctx) {
    const results = await this._queryAll(ctx, (obj) => obj._type === "tourist");
    return JSON.stringify(results);
  }

  async getAllAlerts(ctx) {
    const results = await this._queryAll(ctx, (obj) => obj._type === "sos_alert");
    return JSON.stringify(results);
  }

  async getAllEFIRs(ctx) {
    const results = await this._queryAll(ctx, (obj) => obj._type === "efir");
    return JSON.stringify(results);
  }

  async _queryAll(ctx, predicateFn) {
    const iterator = await ctx.stub.getStateByRange("", "");
    const results = [];
    for await (const res of iterator) {
      if (!res.value || res.value.length === 0) continue;
      try {
        const obj = JSON.parse(res.value.toString());
        if (!predicateFn || predicateFn(obj)) {
          results.push(obj);
        }
      } catch (_) {}
    }
    return results;
  }

  async _exists(ctx, key) {
    const buf = await ctx.stub.getState(key);
    return !!buf && buf.length > 0;
  }

  _touristKey(id) { return `TOURIST_${id}`; }
  _alertKey(id) { return `ALERT_${id}`; }
  _efirKey(id) { return `EFIR_${id}`; }
}

module.exports = TouristSafetyContract;
