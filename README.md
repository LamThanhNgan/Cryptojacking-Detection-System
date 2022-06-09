# Crytpjacking

## Cryptojacking
Là một loại fileless malware khai thác tiền điện tử mới hoạt động bí mật trên các trình duyệt của người dùng cuối dựa trên công nghệ web mới nhất và dễ dàng tiếp cận nạn nhân của nó thông qua các trang web mà không yêu cầu bất kỳ cài đặt phần mềm nào. Nó chạy ẩn trong nền, yên lặng đào tiền ảo trên thiết bị của bạn và sau đó gửi cho những kẻ tấn công. Nếu bạn không chú ý thấy máy tính chạy chậm hoặc tiến trình sử dụng 100% CPU, bạn thậm chí còn không nhận ra có phần mềm độc hại trên thiết bị của mình.
## WebAssembly (WASM)
Wasm là một định dạng lệnh nhị phân cấp thấp chạy mã gần với tốc độ gốc trong máy ảo dựa trên stack trong trình duyệt, được hỗ trợ bởi 4 trình duyệt chính gồm gg chrome, Mozilla Firefox, Microsoft Edge và Safari
- Hiệu quả về kích thước, thời gian tải, tốc độ thực thi
- o	Dễ giải mã, k phụ thuộc vào phần cứng và nền tảng, nhỏ gọn
- o	Bổ sung và chạy song song JS (k bỏ JS), được biên dịch trong môi trường Sandbox, sử dụng các Web APIs có sẵn giống JS, các Wasm module có khả năng call in and out of the JS context và truy cập chức năng của trình duyệt
o	Toolchain đc sử dụng rộng rãi để biên dịch C/C++ thành Wasm là LLVM complier
o	Tốc độ gần như nguyên bản của Wasm do các modules đc tối ưu hóa trong quá trình biên dịch và việc quản lí bộ nhớ đc thực hiện mà k cần sử dụng garbage collector

Project của nhóm thực hiện nghiên cứu hệ thống phát hiện Cryptojacking trên thời gian thực.
