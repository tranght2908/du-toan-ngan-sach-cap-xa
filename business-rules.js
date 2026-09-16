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

  const demoAccounts = [
    { role: 'admin', username: 'qt.khoa', password: 'Demo@2027' },
    { role: 'lap', username: 'tckt.ha', password: 'Demo@2027' },
    { role: 'tiepnhan', username: 'tn.phuc', password: 'Demo@2027' },
    { role: 'thamtra', username: 'bktns.lan', password: 'Demo@2027' },
    { role: 'thamquyen', username: 'hdnd.tung', password: 'Demo@2027' },
    { role: 'phanbo', username: 'thns.ngan', password: 'Demo@2027' },
    { role: 'theodoi', username: 'kt.bao', password: 'Demo@2027' },
  ];

  const permissions = {
    admin: {
      steps: 'Bước 1', scope: 'Toàn hệ thống',
      actions: ['Quản lý kỳ, danh mục và tài khoản', 'Mở hoặc đóng kỳ theo điều kiện hoàn tất', 'Xem toàn bộ hồ sơ, báo cáo và nhật ký'],
      limits: 'Không lập, thẩm tra, phê duyệt, phân bổ hoặc giao thay vai trò nghiệp vụ.',
    },
    lap: {
      steps: 'Bước 2–3', scope: 'Hồ sơ thuộc đơn vị dự toán',
      actions: ['Ghi nhận số giao từ cấp trên', 'Lập, sửa và ký số gửi hồ sơ', 'Sửa phiên bản bị trả lại và lập hồ sơ điều chỉnh/bổ sung'],
      limits: 'Chỉ sửa hồ sơ nháp hoặc phiên bản được trả lại; chỉ xem kết quả xử lý các bước sau.',
    },
    tiepnhan: {
      steps: 'Bước 4', scope: 'Hồ sơ đã gửi chờ tiếp nhận',
      actions: ['Kiểm tra kỳ, biểu mẫu và thành phần hồ sơ', 'Tiếp nhận chuyển thẩm tra', 'Trả lại, nêu rõ yêu cầu bổ sung'],
      limits: 'Không sửa số liệu dự toán, không thẩm tra hoặc phê duyệt.',
    },
    thamtra: {
      steps: 'Bước 5–6', scope: 'Hồ sơ đã tiếp nhận',
      actions: ['Nhập kết quả và ý kiến thẩm tra', 'Yêu cầu giải trình/chỉnh sửa', 'Lập báo cáo thẩm tra, ký số và trình'],
      limits: 'Không thay số đề nghị của đơn vị, không phê duyệt hay giao dự toán.',
    },
    thamquyen: {
      steps: 'Bước 7', scope: 'Hồ sơ đã trình, đang khóa',
      actions: ['Xem hồ sơ trình và báo cáo thẩm tra', 'Phê duyệt dự toán', 'Ký số quyết định phê duyệt', 'Yêu cầu hoàn thiện hồ sơ'],
      limits: 'Không sửa hồ sơ trình, không Phân bổ, giao dự toán.',
    },
    phanbo: {
      steps: 'Bước 8–9', scope: 'Dự toán đã được phê duyệt',
      actions: ['Lập và chốt phương án phân bổ', 'Ký số, ban hành và giao dự toán', 'Tra cứu tình trạng phân bổ/giao'],
      limits: 'Không sửa quyết định phê duyệt hoặc số liệu hồ sơ nguồn.',
    },
    theodoi: {
      steps: 'Bước 10', scope: 'Dự toán đã giao',
      actions: ['Theo dõi khoản đã giao và lịch sử điều chỉnh', 'Xem khoản cần xử lý', 'Tra cứu, in và xuất biểu mẫu báo cáo'],
      limits: 'Chỉ xem; không sửa, phê duyệt, phân bổ hoặc giao dự toán.',
    },
  };

  function rolePermissions(role) {
    return permissions[role] || { steps: '—', scope: '—', actions: [], limits: 'Không có quyền.' };
  }

  return {
    evaluatePeriodClosure,
    createRevision,
    demoAccounts,
    rolePermissions,
  };
});
