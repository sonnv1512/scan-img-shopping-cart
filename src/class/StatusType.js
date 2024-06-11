export default {
  serverIp: 'https://api.anvui.vn/anvui-driver/',
  reloadTimeOut: 100000000, // 1800000 = 30p
  FlowRouteProvince_status: [
    {
      key: 0,
      label: 'Vừa tạo'
    },
    {
      key: 1,
      label: 'Chờ xử lý'
    },
    {
      key: 2,
      label: 'Đã thanh toán'
    },
    {
      key: 3,
      label: 'Huỷ giao dịch'
    }
  ],
  paymentStatus: [
    {
      key: 0,
      label: 'Vừa tạo'
    },
    {
      key: 1,
      label: 'Chờ xử lý'
    },
    {
      key: 2,
      label: 'Đã thanh toán'
    },
    {
      key: 3,
      label: 'Huỷ giao dịch'
    }
  ],
  FlowRouteProvince_type: {
    0: 'noi tinh',
    1: 'quoc gia'
  },
  Point_status: {
    0: 'vừa tạo',
    1: 'da duyet'
  },
  UserSystem_userLevel: {
    0: 'Cục',
    1: 'Sở',
    2: 'Nhân viên Sở'
  },
  VehicleBusiness_status: { // (đơn xin cấp luồng)
    0: 'Chờ phê duyệt',
    1: 'Đã duyệt',
    2: 'Từ chối'
  },
  Good_type2: {
    0: 'Hàng hóa thường',
    1: 'Hàng mau hỏng'
  },
  GoodType: [
    {
      key: 0,
      label: 'Hàng hóa phục vụ các hoạt động sản xuất kinh doanh không bị dừng hoặc cấm hoạt động theo chỉ đạo của UBND cấp tỉnh, Ban Chỉ đạo về phòng, chống dịch bệnh Covid-19 của tỉnh, thành phố trực thuộc Trung ương'
    },
    {
      key: 1,
      label: 'Hàng hóa thiết yếu khác theo hướng dẫn của UBND các tỉnh, thành phố trực thuộc Trung ương (nơi nhận hàng của hành trình vận chuyển hàng hóa thiết yếu) hoặc đầu mối do UBND tỉnh, thành phố trực thuộc Trung ương chỉ định'
    },
    {
      key: 2,
      label: 'Hàng hóa thiết yếu theo hướng dẫn tại văn bản số 4349/BCT-TTTN ngày 21/7/2021 của Bộ Công Thương về hàng hóa, dịch vụ thiết yếu'
    }
  ],
  jobTitle: [
    {
      key: 0,
      label: 'Thuyền trưởng'
    },
    {
      key: 1,
      label: 'Máy trưởng'
    },
    {
      key: 2,
      label: 'Thủy thủ'
    },
    {
      key: 3,
      label: 'Trợ máy'
    },
    {
      key: 4,
      label: 'Chức vụ khác'
    }
  ]
}
