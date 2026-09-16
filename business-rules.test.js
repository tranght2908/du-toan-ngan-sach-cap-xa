const test = require('node:test');
const assert = require('node:assert/strict');

const { evaluatePeriodClosure, createRevision, demoAccounts, rolePermissions } = require('./business-rules.js');

test('chỉ cho đóng kỳ khi mọi hồ sơ dự toán năm đã hoàn tất Bước 10', () => {
  const result = evaluatePeriodClosure([
    { id: 'hs-01', ma: 'HS-2027-001', loai: 'DT', node: 'n10' },
    { id: 'hs-02', ma: 'HS-2027-002', loai: 'DT', node: 'n7' },
  ]);

  assert.equal(result.canClose, false);
  assert.deepEqual(result.blockers, [{ id: 'hs-02', ma: 'HS-2027-002', node: 'n7' }]);
});

test('cho đóng kỳ khi có hồ sơ dự toán và tất cả đã hoàn tất Bước 10', () => {
  const result = evaluatePeriodClosure([
    { id: 'hs-01', ma: 'HS-2027-001', loai: 'DT', node: 'n10' },
    { id: 'hs-dc', ma: 'HS-2027-DC01', loai: 'DC', node: 'n4' },
  ]);

  assert.equal(result.canClose, true);
  assert.deepEqual(result.blockers, []);
});

test('trả lại khóa v1 và tạo ngay v2 có dữ liệu kế thừa để chỉnh sửa', () => {
  const draft = {
    phienBan: 1,
    lines: [{ id: 'L1', deNghi: 100, thamTra: 100, duyet: null }],
    nguonDK: [{ id: 'N1', so: 100 }],
    taiLieu: [{ id: 'T1', ten: 'To trinh.pdf' }],
    giaiTrinh: 'Bản gửi lần đầu',
    versions: [{ v: 1, st: 'Đã gửi – chờ tiếp nhận', lines: [{ id: 'L1', deNghi: 100 }] }],
  };

  const result = createRevision(draft, {
    buoc: 4,
    role: 'tiepnhan',
    note: 'Bổ sung căn cứ nguồn',
    t: '2026-09-16T09:00:00.000Z',
  });

  assert.equal(result.phienBan, 2);
  assert.equal(result.versions[0].st, 'Bị trả lại');
  assert.equal(result.versions[0].ketQua.note, 'Bổ sung căn cứ nguồn');
  assert.equal(result.versions[1].v, 2);
  assert.equal(result.versions[1].st, 'Bản sửa – chưa gửi');
  assert.equal(result.versions[1].sourceVersion, 1);
  assert.equal(result.versions[1].lines.length, 1);
  assert.equal(result.versions[1].lines[0].deNghi, 100);
  assert.notStrictEqual(result.versions[1].lines, result.versions[0].lines);
});

test('mỗi vai trò có tài khoản demo và mật khẩu mô phỏng thống nhất', () => {
  assert.equal(demoAccounts.length, 7);
  assert.deepEqual(demoAccounts.map(account => account.role), ['admin', 'lap', 'tiepnhan', 'thamtra', 'thamquyen', 'phanbo', 'theodoi']);
  assert.ok(demoAccounts.every(account => account.password === 'Demo@2027'));
});

test('ma trận quyền giới hạn thao tác theo vai trò', () => {
  const lap = rolePermissions('lap');
  const thamquyen = rolePermissions('thamquyen');
  const admin = rolePermissions('admin');

  assert.ok(lap.actions.includes('Lập, sửa và ký số gửi hồ sơ'));
  assert.ok(!lap.actions.includes('Phê duyệt dự toán'));
  assert.ok(thamquyen.actions.includes('Phê duyệt dự toán'));
  assert.ok(!thamquyen.actions.includes('Phân bổ, giao dự toán'));
  assert.ok(admin.actions.includes('Quản lý kỳ, danh mục và tài khoản'));
});
