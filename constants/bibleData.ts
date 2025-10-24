// Bible data constants
export interface Book {
  shortName: string;
  code: string;
  name: string;
}

export interface BookDetail {
  author: string;
  time: string;
  place: string;
  recipients: string;
  theme: string;
}

export interface Footnote {
  id: string;
  text: string;
}

export const CHAPTER_COUNTS: { [key: string]: number } = {
  'mat': 28, 'mac': 16, 'lu': 24, 'gi': 21, 'cong': 28, 'la': 16,
  '1co': 16, '2co': 13, 'ga': 6, 'eph': 6, 'phil': 4, 'col': 4,
  '1te': 5, '2te': 3, '1ti': 6, '2ti': 4, 'tit': 3, 'plm': 1,
  'he': 13, 'gia': 5, '1phi': 5, '2phi': 3, '1gi': 5, '2gi': 1,
  '3gi': 1, 'giu': 1, 'khai': 22
};

export const BOOK_DETAILS: { [key: string]: BookDetail } = {
  'mat': {
    author: 'Ma-thi-ơ, cũng gọi là Lê-vi, trước đây là một người thu thuế, về sau là một sứ đồ (9:9; Lu. 5:27)',
    time: 'Khoảng năm 37-40 S.C., không lâu sau khi Chúa phục sinh (28:15) và trước khi đền thờ bị hủy phá (24:2)',
    place: 'Có lẽ là xứ Giu-đê',
    recipients: 'Người Do Thái nói chung',
    theme: 'Phúc âm vương quốc – Chứng minh rằng Jesus Christ là Đấng cứu rỗi–Nhà vua'
  },
  'mac': {
    author: 'Mác',
    time: 'Giữa năm 67 và 70 S.C., sau khi sứ đồ Phao-lô qua đời',
    place: 'Có lẽ là La Mã',
    recipients: 'Dân ngoại, đặc biệt là người La Mã',
    theme: 'Phúc âm của Đức Chúa Trời – Chứng minh rằng Jesus Christ là Đấng cứu rỗi–Nô lệ'
  },
  'lu': {
    author: 'Lu-ca',
    time: 'Khoảng năm 60 S.C., trước khi sách Công vụ các Sứ đồ được viết',
    place: 'Có lẽ là Sê-sa-rê',
    recipients: 'Thê-ô-phi-lơ',
    theme: 'Phúc âm tha thứ các tội phạm – Chứng minh rằng Jesus Christ là Đấng cứu rỗi–Con người'
  },
  'gi': {
    author: 'Sứ đồ Giăng',
    time: 'Khoảng năm 85-90 S.C',
    place: 'Có lẽ là Ê-phê-sô',
    recipients: 'Tất cả các tín đồ',
    theme: 'Phúc âm sự sống – Chứng minh rằng Jesus Christ là Đức Chúa Trời, Đấng cứu rỗi, đến như là sự sống để truyền bá chính Ngài'
  },
  'cong': {
    author: 'Lu-ca',
    time: '67 hoặc 68 S.C., sau khi viết Phúc âm Lu-ca',
    place: 'Có lẽ là La Mã',
    recipients: 'Thê-ô-phi-lơ',
    theme: 'Truyền bá Đấng Christ phục sinh trong sự thăng thiên của Ngài, bởi Linh, qua các môn đồ, để sản sinh các Hội thánh – Vương quốc Đức Chúa Trời'
  },
  'la': {
    author: 'Sứ đồ Phao-lô (1:1)',
    time: 'Khoảng năm 60 S.C, trong cuộc hành trình chức vụ thứ ba của Phao-lô',
    place: 'Cô-rin-tô',
    recipients: 'Các thánh đồ tại La Mã (1:7)',
    theme: 'Phúc âm của Đức Chúa Trời – Làm cho tội nhân trở thành các con của Đức Chúa Trời để cấu thành Thân thể Đấng Christ, được biểu lộ như các Hội thánh địa phương'
  },
  '1co': {
    author: 'Sứ đồ Phao-lô (1:1; 9:1-2)',
    time: 'Khoảng năm 59 S.C., gần cuối thời gian ba năm Phao-lô ở tại Ê-phê-sô',
    place: 'Ê-phê-sô',
    recipients: 'Các thánh đồ – Hội thánh – tại Cô-rin-tô và mọi người kêu đến danh Chúa Jesus Christ chúng ta ở khắp nơi (1:2)',
    theme: 'Christ và thập tự giá của Ngài là giải pháp cho mọi nan đề trong Hội thánh'
  },
  '2co': {
    author: 'Sứ đồ Phao-lô (1:1)',
    time: 'Khoảng năm 60 S.C., trước Thư tín viết cho người La Mã',
    place: 'Ma-xê-đô-ni-a',
    recipients: 'Hội thánh của Đức Chúa Trời tại Cô-rin-tô, cùng với tất cả thánh đồ ở khắp A-chai (1:1)',
    theme: 'Chức vụ và chấp sự của giao ước mới'
  },
  'ga': {
    author: 'Sứ đồ Phao-lô (1:1)',
    time: 'Khoảng năm 54 S.C., trong suốt cuộc hành trình chức vụ thứ nhì của Phao-lô',
    place: 'Cô-rin-tô',
    recipients: 'Các Hội thánh tại Ga-la-ti (1:2)',
    theme: 'Đấng Christ thay thế kinh luật, đối kháng tôn giáo và truyền thống'
  },
  'eph': {
    author: 'Sứ đồ Phao-lô (1:1)',
    time: 'Khoảng năm 64 S.C',
    place: 'La Mã, nơi Phao-lô bị tù',
    recipients: 'Các thánh đồ tại Ê-phê-sô (1:1)',
    theme: 'Hội thánh – Huyền nhiệm của Đấng Christ, Thân thể Đấng Christ như sự đầy đủ của Đấng Christ, trở nên sự đầy đủ của Đức Chúa Trời'
  },
  'phil': {
    author: 'Phao-lô với Ti-mô-thê, các nô lệ của Christ Jesus (1:1)',
    time: 'Khoảng năm 64 S.C., có lẽ sau khi viết thư Ê-phê-sô',
    place: 'La Mã, nơi Phao-lô bị tù',
    recipients: 'Các thánh đồ ở Phi-líp, bao gồm các giám mục và các chấp sự (1:1)',
    theme: 'Kinh nghiệm Christ – Nhận Christ làm nếp sống, gương mẫu, mục tiêu, quyền năng và bí quyết của chúng ta'
  },
  'col': {
    author: 'Sứ đồ Phao-lô cùng với Ti-mô-thê là anh em (1:1)',
    time: 'Khoảng năm 64 S.C., khi Thư cho Phi-lê-môn được viết',
    place: 'La Mã, nơi Phao-lô bị tù',
    recipients: 'Các thánh đồ tại Cô-lô-se (1:2)',
    theme: 'Christ – Đấng bao-hàm-tất-cả, có vị trí đầu nhất trong mọi sự, là huyền nhiệm và hiện thân của Đức Chúa Trời, là Đầu và thành phần cấu tạo của Hội thánh, là phần được chia, sự sống, thành phần cấu tạo và hi vọng của các thánh đồ, và là thể của mọi điều tích cực'
  },
  '1te': {
    author: 'Phao-lô cùng với Sin-vanh và Ti-mô-thê (1:1)',
    time: 'Khoảng năm 54 S.C., trong cuộc hành trình chức vụ thứ nhì của Phao-lô',
    place: 'Cô-rin-tô',
    recipients: 'Hội thánh của người Tê-sa-lô-ni-ca (1:1)',
    theme: 'Đời sống thánh biệt vì nếp sống Hội thánh – Phục vụ Đức Chúa Trời hằng sống, cư xử cách thánh biệt, và trông đợi Chúa đến'
  },  
  '2te': {
    author: 'Phao-lô với Sin-vanh và Ti-mô-thê (1:1)',
    time: 'Khoảng năm 54 S.C., như Thư thứ nhất (1:1)',
    place: 'Cô-rin-tô',
    recipients: 'Hội thánh của người Tê-sa-lô-ni-ca (1:1)',
    theme: 'Sự khích lệ và sửa sai về đời sống thánh biệt vì nếp sống Hội thánh'
  },
  '1ti': {
    author: 'Sứ đồ Phao-lô (1:1)',
    time: 'Khoảng năm 65 S.C., sau khi Phao-lô bị tù ở La Mã lần thứ nhất',
    place: 'Có lẽ là Ma-xê-đô-ni-a (1:3)',
    recipients: 'Ti-mô-thê (1:2)',
    theme: 'Gia tể của Đức Chúa Trời về Hội thánh'
  },
  '2ti': {
    author: 'Sứ đồ Phao-lô (1:1)',
    time: 'Khoảng năm 67 S.C., trong khi Phao-lô bị tù lần thứ nhì, gần lúc ông tử đạo (4:6)',
    place: 'Nhà tù La Mã (1:16-17)',
    recipients: 'Ti-mô-thê (1:2)',
    theme: 'Tiêm ngừa chống lại sự suy bại của Hội thánh'
  },
  'tit': {
    author: 'Sứ đồ Phao-lô (1:1)',
    time: 'Khoảng năm 65 S.C., sau khi Phao-lô ra khỏi nhà tù La Mã lần thứ nhất',
    place: 'Ni-cô-bô-li',
    recipients: 'Tít (1:4)',
    theme: 'Duy trì trật tự trong Hội thánh'
  },
  'plm': {
    author: 'Sứ đồ Phao-lô cùng Ti-mô-thê là anh em (c. 1)',
    time: 'Khoảng năm 64 S.C., không lâu trước khi Phao-lô ra tù lần thứ nhất tại La Mã',
    place: 'Nhà tù La Mã',
    recipients: 'Phi-lê-môn, Áp-phi, A-chíp và Hội thánh ở trong nhà họ (cc. 1-2)',
    theme: 'Một minh họa về địa vị bình đẳng của tín đồ trong người mới'
  },
  'he': {
    author: 'Hiển nhiên là sứ đồ Phao-lô',
    time: 'Có lẽ là năm 67 S.C., sau khi Phao-lô ra khỏi tù La Mã lần thứ nhất',
    place: 'Có lẽ là Mi-lết',
    recipients: 'Những tín đồ Hê-bơ-rơ',
    theme: 'Christ trỗi hơn Do Thái giáo và mọi điều liên quan đến nó, và giao ước mới mà Ngài hoàn thành tốt hơn giao ước cũ'
  },
  'Gia': {
    author: 'Gia-cơ, nô lệ của Đức Chúa Trời và của Chúa Jesus Christ; anh em về phần xác của Chúa (1:1; Mat. 13:55)',
    time: 'Có lẽ khoảng năm 50 S.C., trước sự suy bại của Hội thánh',
    place: 'Có lẽ Giê-ru-sa-lem',
    recipients: 'Mười hai chi phái đang tản trú',
    theme: 'Sự hoàn hảo Cơ Đốc thực tiễn'
  },
  '1phi': {
    author: 'Phi-e-rơ, sứ đồ của Jesus Christ (1:1)',
    time: 'Có lẽ khoảng năm 64 S.C., trước khi Phao-lô tử đạo',
    place: 'Cô-rin-tô',
    recipients: 'Ba-by-lôn trên sông Ơ-phơ-rát',
    theme: 'Đời sống Cơ Đốc dưới chính quyền của Đức Chúa Trời'
  },  
  '2phi': {
    author: 'Phi-e-rơ, nô lệ và sứ đồ của Jesus Christ (1:1)',
    time: 'Có lẽ khoảng năm 69 S.C., sau khi Phao-lô tử đạo',
    place: 'Có lẽ là La Mã',
    recipients: 'Tín đồ Do Thái tản trú trong thế giới dân ngoại',
    theme: 'Sự ban cấp thần thượng và chính quyền thần thượng'
  },
  '1gi': {
    author: 'Giăng, tác giả Phúc âm Giăng',
    time: 'Khoảng năm 90-95 S.C., sau khi Giăng trở về từ chốn lưu đày trên đảo Pát-mô',
    place: 'Ê-phê-sô',
    recipients: 'Tín đồ nói chung, những người có sự sống đời đời của Đức Chúa Trời bởi tin vào Con Đức Chúa Trời (5:11-13)',
    theme: 'Sự tương giao của sự sống thần thượng'
  },
  '2gi': {
    author: 'Trưởng lão Giăng (c. 1)',
    time: 'Sau khi viết Thư thứ nhất',
    place: ' Ê-phê-sô',
    recipients: 'Một phu nhân được chọn và con cái bà',
    theme: 'Ngăn cấm dự phần vào tà giáo'
  },
  '3gi': {
    author: 'Trưởng lão Giăng (c. 1)',
    time: 'Sau khi viết Thư thứ nhì',
    place: ' Ê-phê-sô',
    recipients: 'Gai-út (c. 1 và chú thích 2)',
    theme: 'Khích lệ các đồng công trong lẽ thật'
  },
  'giu': {
    author: 'Giu-đe, nô lệ của Jesus Christ và anh em về phần xác của Gia-cơ',
    time: 'Khoảng năm 69 S.C., trước khi Giê-ru-sa-lem bị hủy phá',
    place: 'Giê-ru-sa-lem hoặc Giu-đê',
    recipients: 'Tín đồ Do Thái',
    theme: 'Chiến đấu vì đức tin'
  },
  'khai': {
    author: 'Sứ đồ Giăng (1:1, 9)',
    time: 'Khoảng năm 90 S.C., trong khi Giăng bị đày trên đảo Pát-mô',
    place: 'Đảo Pát-mô (1:9)',
    recipients: 'Bảy Hội thánh tại A-si (1:4)',
    theme: 'Christ là trung tâm quản trị của Đức Chúa Trời theo gia tể đời đời của Đức Chúa Trời'
  }
};

export const BOOK_NAMES: Book[] = [
  { shortName: "Mat", name: "Ma-thi-ơ", code: "mat" },
  { shortName: "Mác", name: "Mác", code: "mac" },
  { shortName: "Lu", name: "Lu-ca", code: "lu" },
  { shortName: "Gi", name: "Giăng", code: "gi" },
  { shortName: "Công", name: "Công vụ các Sứ đồ", code: "cong" },
  { shortName: "La", name: "La Mã", code: "la" },
  { shortName: "1 Cô", name: "1 Cô-rin-tô", code: "1co" },
  { shortName: "2 Cô", name: "2 Cô-rin-tô", code: "2co" },
  { shortName: "Ga", name: "Ga-la-ti", code: "ga" },
  { shortName: "Êph", name: "Ê-phê-sô", code: "eph" },
  { shortName: "Phil", name: "Phi-líp", code: "phil" },
  { shortName: "Côl", name: "Cô-lô-se", code: "col" },
  { shortName: "1 Tê", name: "1 Tê-sa-lô-ni-ca", code: "1te" },
  { shortName: "2 Tê", name: "2 Tê-sa-lô-ni-ca", code: "2te" },
  { shortName: "1 Ti", name: "1 Ti-mô-thê", code: "1ti" },
  { shortName: "2 Ti", name: "2 Ti-mô-thê", code: "2ti" },
  { shortName: "Tít", name: "Tít", code: "tit" },
  { shortName: "Plm", name: "Phi-lê-môn", code: "plm" },
  { shortName: "Hê", name: "Hê-bơ-rơ", code: "he" },
  { shortName: "Gia", name: "Gia-cơ", code: "gia" },
  { shortName: "1 Phi", name: "1 Phi-e-rơ", code: "1phi" },
  { shortName: "2 Phi", name: "2 Phi-e-rơ", code: "2phi" },
  { shortName: "1 Gi", name: "1 Giăng", code: "1gi" },
  { shortName: "2 Gi", name: "2 Giăng", code: "2gi" },
  { shortName: "3 Gi", name: "3 Giăng", code: "3gi" },
  { shortName: "Giu", name: "Giu-đe", code: "giu" },
  { shortName: "Khải", name: "Khải Thị", code: "khai" }
];
