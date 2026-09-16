(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.BudgetBusinessRules = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const clone = value => JSON.parse(JSON.stringify(value));

  function evaluatePeriodClosure(records) {
    const annualBudgets = records.filter(record => record.loai === 'DT');
    const blockers = annualBudgets
      .filter(record => record.node !== 'n10')
      .map(record => ({ id: record.id, ma: record.ma, node: record.node }));
    return { canClose: annualBudgets.length > 0 && blockers.length === 0, blockers };
  }

  function createRevision(draft, returnInfo) {
    const revised = clone(draft);
    const current = revised.versions.find(version => version.v === revised.phienBan) || revised.versions[revised.versions.length - 1];

    current.st = 'Bị trả lại';
    current.ketQua = clone(returnInfo);
    current.lines = clone(revised.lines);
    current.nguonDK = clone(revised.nguonDK);
    current.taiLieu = clone(revised.taiLieu);
    current.giaiTrinh = revised.giaiTrinh || '';

    revised.phienBan = Math.max(...revised.versions.map(version => version.v)) + 1;
    revised.lines.forEach(line => { line.thamTra = null; line.ykTT = ''; line.duyet = null; });
    revised.checklist = {};
    revised.bcTT = null;
    revised.versions.push({
      v: revised.phienBan,
      t: returnInfo.t,
      createdAt: returnInfo.t,
      nguoi: draft.nguoiLap || '',
      st: 'Bản sửa – chưa gửi',
      sourceVersion: current.v,
      returnInfo: clone(returnInfo),
      lines: clone(revised.lines),
      nguonDK: clone(revised.nguonDK),
      taiLieu: clone(revised.taiLieu),
      giaiTrinh: revised.giaiTrinh || '',
      kySo: null,
    });
    return revised;
  }

  return {
    evaluatePeriodClosure,
    createRevision,
  };
});
