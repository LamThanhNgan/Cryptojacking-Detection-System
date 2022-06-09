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

### Mô hình phát hiện cryptojacking malware

![image](https://user-images.githubusercontent.com/60861471/172760533-1a619601-52d1-4a85-ae02-713beb2dd524.png)
 
Mô hình gồm 4 giai đoạn chính:
- **Wasm module auto-collector:** bộ thu module tự động, khi ng dùng đang sd trình duyệt web thì nó sẽ chạy liên tục trong nền, kiểm tra xem các web đang đc truy cập này có đang tạo ra bất kì tệp nhị phân Wasm nào không, nếu có thì tự động tải và trích xuất tệp nhị phân Wasm đc liên kết vào 1 folder đc chỉ định (chỉ tải Wasm binaries và không tải bất kì thành phần trang web khác, nếu có nhiều hơn 1 module Wasm thì tải xuống toàn bộ)
- **Preprocessor:** bộ tiền xử lí, nó sẽ đọc các folder đc tải xuống trc đó và chuyển đổi từng tệp nhị phân trong folder thành hình ảnh gray-scale và tiếp tục xử lí trước hình ảnh này thành 1 dạng mà mạng nơ-ron có thể sử dụng làm đầu vào (thay đổi kích thước nó thành kích thước chung). Preprocessor chuyển đổi nhị phân thành 1 mảng các số nguyên với mỗi số nguyên đại diện cho một pixel của gray-scale, sau đó chuẩn hóa và định hình (normalizes and reshapes) lại mảng kết quả rồi chuyển qua Wasm classifier
- **Wasm classifier:** bộ phân loại wasm, các mã nhị phân đã chuyển đổi đc đưa vào đây, một CNN đc đào tạo trước sẽ phân loại từng tệp nhị phân đc xử lí trc đó là độc hại hay lành tính
- **Notifier:** bộ thông báo, dựa vào kết quả phân loại trên sẽ quyết định có thông báo ng dùng về hd khai thác độc hại hay không. Nếu phát hiện là độc hại thì sẽ thông báo ng dùng trang web mà họ đang truy cập sử dụng tài nguyên tính toán của họ để khai thác tiền điện tử và họ nên đóng nó và chấm dứt mọi quy trình khai thác chạy trong nền. Nếu đó là tệp nhị phân lành tính thì sẽ ko thông báo làm gián đoạn ng dùng, và Wasm Module Auto-collector sẽ tiếp tục kiểm tra việc khởi tạo Wasm module 

**Source code này sẽ thực hiện 2 công đoạn trong 4 công đoạn trên là: Wasm module auto-collector và Preprocessor**
## Thực hiện
### Wasm module auto-collector
Thực hiện tìm kiếm và thu thập Web assembly module từ các trang web cho trước, tạo thư mục lưu trữ và lưu các module đó thành từng file trong thư mục đã tạo.
#### Yêu cầu:
1. Cài đặt NodeJS và npm
2. Chạy lệnh <code>npm install</code> để cài đặt các dependencies
3. Thực hiện thu thập bằng lệnh: 
~~~bash
node main.js list.txt
~~~

Trong đó list.txt là danh sách các trang web.

Nếu thu thập được wasm-module từ trang web thì một thu mục **wasm/** sẽ được tạo kèm theo thư mục con chứa file WebAssembly (wasm) binary module.

**Kết quả:**

![Screenshot 2022-06-09 113722](https://user-images.githubusercontent.com/60861471/172765247-3baf205f-364d-4f9c-a40f-04d03b923823.png)


