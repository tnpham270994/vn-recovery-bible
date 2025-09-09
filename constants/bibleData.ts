// Bible data constants
export interface Book {
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
  'Mat': 28, 'Mác': 16, 'Lu': 24, 'Gi': 21, 'Công': 28, 'La': 16,
  '1 Cô': 16, '2 Cô': 13, 'Ga': 6, 'Êph': 6, 'Phil': 4, 'Côl': 4,
  '1 Tê': 5, '2 Tê': 3, '1 Ti': 6, '2 Ti': 4, 'Tít': 3, 'Philm': 1,
  'Hê': 13, 'Gia': 5, '1 Phi': 5, '2 Phi': 3, '1 Gi': 5, '2 Gi': 1,
  '3 Gi': 1, 'Giu': 1, 'Khải': 22
};

export const BOOK_DETAILS: { [key: string]: BookDetail } = {
  'Mat.': {
    author: 'Ma-thi-ơ, cũng gọi là Lê-vi, trước đây là một người thu thuế, về sau là một sứ đồ (9:9; Lu. 5:27)',
    time: 'Khoảng năm 37-40 S.C., không lâu sau khi Chúa phục sinh (28:15) và trước khi đền thờ bị hủy phá (24:2)',
    place: 'Có lẽ là xứ Giu-đê',
    recipients: 'Người Do Thái nói chung',
    theme: 'Phúc âm vương quốc – Chứng minh rằng Jesus Christ là Đấng cứu rỗi – Nhà vua'
  },
  'Mác': {
    author: 'Mác, cũng gọi là Giăng Mác, con của Ma-ri (Công. 12:12)',
    time: 'Khoảng năm 50-60 S.C.',
    place: 'Có lẽ là Rô-ma',
    recipients: 'Người La Mã và dân ngoại',
    theme: 'Phúc âm của Chúa Jesus Christ, Con Đức Chúa Trời'
  },
  'Lu.': {
    author: 'Lu-ca, bác sĩ yêu dấu (Côl. 4:14)',
    time: 'Khoảng năm 60-61 S.C.',
    place: 'Có lẽ là Rô-ma',
    recipients: 'Thê-ô-phi-lơ và tất cả các tín đồ',
    theme: 'Phúc âm của sự cứu rỗi cho tất cả mọi người'
  },
  'Gi.': {
    author: 'Giăng, sứ đồ yêu dấu của Chúa Jesus',
    time: 'Khoảng năm 85-90 S.C.',
    place: 'Có lẽ là Ê-phê-sô',
    recipients: 'Tất cả các tín đồ',
    theme: 'Phúc âm của sự sống đời đời'
  },
  'Công.': {
    author: 'Lu-ca, tác giả của sách Lu-ca',
    time: 'Khoảng năm 61-63 S.C.',
    place: 'Có lẽ là Rô-ma',
    recipients: 'Thê-ô-phi-lơ',
    theme: 'Lịch sử của Hội thánh ban đầu'
  },
  'La.': {
    author: 'Phao-lô, sứ đồ của Chúa Jesus Christ',
    time: 'Khoảng năm 57-58 S.C.',
    place: 'Cô-rinh-tô',
    recipients: 'Tất cả các tín đồ ở Rô-ma',
    theme: 'Phúc âm của sự công bình của Đức Chúa Trời'
  }
};

export const FOOTNOTES_DATA: { [key: string]: { [key: number]: { [key: number]: Footnote[] } } } = {
  'Mat.': {
    1: {
      1: [
        { id: '1', text: "Gia phổ: Bản ghi chép về dòng dõi tổ tiên, thường được dùng để chứng minh quyền thừa kế hoặc danh phận." },
        { id: '2', text: "Jesus Christ: Jesus là tên riêng, có nghĩa là 'Đức Giê-hô-va là sự cứu rỗi'. Christ là tước hiệu, có nghĩa là 'Đấng được xức dầu' hoặc 'Đấng Mê-si'." },
        { id: '3', text: "Đa-vít: Vua thứ hai của Y-sơ-ra-ên, được gọi là 'người theo lòng Đức Chúa Trời'. Chúa Jesus là con cháu của Đa-vít theo huyết thống." },
        { id: '4', text: "Áp-ra-ham: Tổ phụ của dân Y-sơ-ra-ên, được gọi là 'bạn của Đức Chúa Trời'. Chúa Jesus là con cháu của Áp-ra-ham theo lời hứa." },
        { id: 'a', text: "Con cháu: Chỉ về dòng dõi huyết thống, thể hiện sự liên tục của gia phả từ thế hệ này sang thế hệ khác." },
        { id: 'b', text: "Huyết thống: Mối liên hệ gia đình qua dòng máu, quan trọng trong việc xác định quyền thừa kế và danh phận." },
        { id: 'c', text: "Lời hứa: Đức Chúa Trời đã hứa với Áp-ra-ham rằng qua dòng dõi người, tất cả các dân tộc sẽ được phước." },
        { id: 'd', text: "Vương quốc: Chúa Jesus sẽ cai trị vương quốc đời đời, thực hiện lời hứa về Đấng Mê-si đến từ dòng dõi Đa-vít." }
      ]
    }
  }
};

export const VERSE_DATA: { [key: string]: { [key: number]: string[] } } = {
  'Mat.': {
    1: [
      "Gia phổ[1] của Jesus Christ[2], con cháu[a] Đa-vít[3], con cháu Áp-ra-ham[4]",
      "Áp-ra-ham sinh Y-sác; Y-sác sinh Gia-cốp; Gia-cốp sinh Giu-đa và các anh em người;",
      "Giu-đa sinh Pha-rê và Xa-ra bởi Ta-ma; Pha-rê sinh Hết-rôm; Hết-rôm sinh A-ram;",
      "A-ram sinh A-mi-na-đáp; A-mi-na-đáp sinh Na-ách-son; Na-ách-son sinh Sanh-môn;",
      "Sanh-môn sinh Bô-ô bởi Ra-háp; Bô-ô sinh Ô-bết bởi Ru-tơ; Ô-bết sinh Y-sai;"
    ],
    2: [
      "Bấy giờ, sau khi Jesus được sinh ra tại Bết-lê-hem thuộc Giu-đê trong đời vua Hê-rốt, kia, các nhà chiêm tình từ phương Đông đến Giê-ru-sa-lem,",
      "nói rằng: \"Đấng đã được sinh ra làm Vua dân Do Thái ở đâu? Bởi lẽ, chúng tôi đã thấy ngôi sao Ngài mọc lên nên đến để thờ phượng Ngài.\"",
      "Khi vua Hê-rốt nghe điều đó thì bối rối, và cả thành Giê-ru-sa-lem cũng vậy.",
      "Vua bèn nhóm hết thảy các thầy tế lễ cả và các thầy thông giáo trong dân lại, mà tra hỏi họ rằng Đấng Christ phải sinh ra tại đâu.",
      "Tâu rằng: \"Tại Bết-lê-hem, xứ Giu-đê, vì có lời tiên tri chép rằng:",
      "Còn ngươi, hỡi Bết-lê-hem, đất Giu-đa! Thật ngươi chẳng phải là kém gì trong các thành lớn của Giu-đa đâu, vì từ nơi ngươi sẽ ra một tướng, là Đấng chăn dân Y-sơ-ra-ên của ta.\""
    ],
    3: [
      "Lúc ấy, Giăng Báp-tít đến giảng trong đồng vắng xứ Giu-đê,",
      "rằng: \"Hãy ăn năn, vì nước thiên đàng đã đến gần!\"",
      "Vì đây là người mà Đấng tiên tri Ê-sai đã nói rằng: Có tiếng kêu trong đồng vắng: Hãy dọn đường Chúa, Ban bằng các nẻo Ngài.",
      "Giăng mặc áo bằng lông lạc đà, thắt lưng bằng da, ăn châu chấu và mật ong rừng.",
      "Bấy giờ, dân thành Giê-ru-sa-lem, cả xứ Giu-đê, và cả miền chung quanh sông Giô-đanh đều đến cùng người,"
    ],
    4: [
      "Bấy giờ, Đức Chúa Jesus được Thánh Linh đưa vào đồng vắng, để chịu ma quỉ cám dỗ.",
      "Sau khi kiêng ăn bốn mươi ngày bốn mươi đêm, thì Ngài đói.",
      "Ma quỉ đến gần Ngài, nói rằng: \"Nếu ngươi là Con Đức Chúa Trời, thì hãy khiến đá nầy trở nên bánh đi.\"",
      "Nhưng Đức Chúa Jesus đáp rằng: \"Có lời chép rằng: Người ta sống chẳng phải chỉ nhờ bánh mà thôi, song nhờ mọi lời nói ra từ miệng Đức Chúa Trời.\"",
      "Ma quỉ bèn đem Ngài vào thành thánh, đặt Ngài trên nóc đền thờ,",
      "và nói rằng: \"Nếu ngươi là Con Đức Chúa Trời, thì hãy gieo mình xuống đi; vì có lời chép rằng: Chúa sẽ truyền cho thiên sứ gìn giữ ngươi, và các đấng ấy sẽ nâng ngươi trong tay, kẻo chân ngươi vấp nhằm đá chăng.\"",
      "Đức Chúa Jesus phán rằng: \"Cũng có lời chép rằng: Ngươi đừng thử Chúa là Đức Chúa Trời ngươi.\"",
      "Ma quỉ lại đem Ngài lên trên núi rất cao, chỉ cho Ngài xem tất cả các nước thế gian, và sự vinh hiển của các nước ấy;",
      "mà nói rằng: \"Ví bằng ngươi sấp mình xuống trước mặt ta, thì ta sẽ cho ngươi hết thảy mọi sự nầy.\"",
      "Đức Chúa Jesus bèn nói với nó rằng: \"Hỡi quỉ Sa-tan, ngươi hãy lui ra! Vì có lời chép rằng: Ngươi phải thờ phượng Chúa là Đức Chúa Trời ngươi, và chỉ hầu việc một mình Ngài mà thôi.\"",
      "Ma quỉ bèn bỏ Ngài; và có các thiên sứ đến gần mà hầu việc Ngài.",
      "Khi Đức Chúa Jesus nghe Giăng bị tù, thì Ngài lánh qua xứ Ga-li-lê.",
      "Rồi Ngài bỏ Na-xa-rét, đến ở thành Ca-bê-na-um, gần mé biển, trong địa phận Sa-bu-lôn và Nép-ta-li,",
      "để cho ứng nghiệm lời đấng tiên tri Ê-sai đã nói rằng:",
      "Đất Sa-bu-lôn và đất Nép-ta-li, về đường dọc theo biển, bên kia sông Giô-đanh, tức là xứ Ga-li-lê của dân ngoại,",
      "dân ngồi trong tối tăm đã thấy ánh sáng lớn; và trên những kẻ ngồi trong miền và dưới bóng sự chết, thì ánh sáng đã mọc lên.",
      "Từ lúc đó, Đức Chúa Jesus khởi giảng dạy rằng: \"Hãy ăn năn, vì nước thiên đàng đã đến gần!\"",
      "Khi Ngài đi dọc theo mé biển Ga-li-lê, thấy hai anh em kia, là Si-môn, cũng gọi là Phi-e-rơ, với em là Anh-rê, đang thả lưới dưới biển; vì hai anh em vốn là người đánh cá.",
      "Ngài bèn phán cùng họ rằng: \"Hãy theo ta, ta sẽ khiến các ngươi trở nên tay đánh lưới người.\"",
      "Họ liền bỏ lưới mà theo Ngài.",
      "Từ đó đi tới nữa, Ngài thấy hai anh em khác, là Gia-cơ, con của Xê-bê-đê, với em là Giăng, đang vá lưới trong thuyền với cha mình; Ngài cũng gọi hai anh em ấy.",
      "Họ liền bỏ thuyền và cha mình mà theo Ngài.",
      "Đức Chúa Jesus đi khắp xứ Ga-li-lê, dạy dỗ trong các nhà hội, giảng tin lành của nước Đức Chúa Trời, và chữa lành mọi thứ tật bệnh trong dân.",
      "Danh tiếng Ngài đồn ra khắp cả xứ Sy-ri; người ta bèn đem đến cho Ngài mọi kẻ bệnh tật, hay là mắc bệnh đau đớn, kẻ bị quỉ ám, kẻ điên cuồng, kẻ bại xuội, thì Ngài chữa cho họ được lành.",
      "Có đoàn dân đông từ xứ Ga-li-lê, xứ Đê-ca-bô-lơ, thành Giê-ru-sa-lem, xứ Giu-đê, và xứ bên kia sông Giô-đanh đều theo Ngài."
    ],
    5: [
      "Khi Đức Chúa Jesus thấy đoàn dân đông, thì Ngài lên trên núi kia; khi Ngài đã ngồi, thì các môn đồ tới gần Ngài.",
      "Ngài bèn mở miệng mà dạy rằng:",
      "\"Phước cho những kẻ có lòng nghèo khó! Vì nước thiên đàng là của những kẻ ấy.",
      "Phước cho những kẻ than khóc! Vì sẽ được yên ủi.",
      "Phước cho những kẻ nhu mì! Vì sẽ hưởng được đất.",
      "Phước cho những kẻ đói khát sự công bình! Vì sẽ được no đủ.",
      "Phước cho những kẻ hay thương xót! Vì sẽ được thương xót.",
      "Phước cho những kẻ có lòng trong sạch! Vì sẽ thấy Đức Chúa Trời.",
      "Phước cho những kẻ làm cho người hòa thuận! Vì sẽ được gọi là con Đức Chúa Trời.",
      "Phước cho những kẻ vì cớ sự công bình mà bị bắt bớ! Vì nước thiên đàng là của những kẻ ấy.\"",
      "\"Khi nào người ta mắng nhiếc, bắt bớ, và lấy mọi điều dữ nói vu cho các ngươi vì cớ ta, thì các ngươi sẽ được phước.",
      "Hãy vui vẻ và nức lòng mừng rỡ, vì phần thưởng các ngươi ở trên trời thì lớn lắm; bởi vì người ta cũng đã bắt bớ các đấng tiên tri trước các ngươi như vậy.\"",
      "\"Các ngươi là muối của đất; song nếu muối mất vị mặn, thì lấy gì mà muối cho mặn lại? Muối ấy không dùng chi được nữa, chỉ phải quăng ra ngoài cho người ta đạp đạp dưới chân.",
      "Các ngươi là sự sáng của thế gian. Một cái thành ở trên núi thì không thể khiến cho khuất được.",
      "Cũng không ai thắp đèn mà để dưới cái thùng, song người ta để trên chân đèn, thì nó soi sáng mọi người ở trong nhà.",
      "Sự sáng các ngươi hãy soi trước mặt người ta như vậy, đặng họ thấy những việc lành của các ngươi, và ngợi khen Cha các ngươi ở trên trời.\"",
      "\"Chớ tưởng ta đến đặng phá luật pháp hay là lời tiên tri; ta đến, không phải để phá, song để làm cho trọn.",
      "Vì ta nói thật cùng các ngươi, đương khi trời đất chưa qua đi, thì một chấm một nét trong luật pháp cũng không qua đi được, cho đến khi mọi sự được trọn.",
      "Vậy thì hễ ai phá một điều rất nhỏ trong những điều răn nầy, và dạy người ta làm như vậy, sẽ bị xưng là rất nhỏ trong nước thiên đàng; song hễ ai giữ và dạy dỗ điều răn ấy, sẽ được xưng là lớn trong nước thiên đàng.\"",
      "Ví dụ: \"Hãy xem #1 để thấy cách Chúa dạy về sự nghèo khó.\"",
      "Ví dụ: \"Xem thêm #3 để hiểu về sự nhu mì.\"",
      "Ví dụ: \"Đọc #5 để biết về sự thương xót.\""
    ]
  }
};

export const BOOK_NAMES: Book[] = [
  { code: "Mat", name: "Ma-thi-ơ" },
  { code: "Mác", name: "Mác" },
  { code: "Lu", name: "Lu-ca" },
  { code: "Gi", name: "Giăng" },
  { code: "Công", name: "Công vụ các Sứ đồ" },
  { code: "La", name: "La Mã" },
  { code: "1 Cô", name: "1 Cô-rin-tô" },
  { code: "2 Cô", name: "2 Cô-rin-tô" },
  { code: "Ga", name: "Ga-la-ti" },
  { code: "Êph", name: "Ê-phê-sô" },
  { code: "Phil", name: "Phi-líp" },
  { code: "Côl", name: "Cô-lô-se" },
  { code: "1 Tê", name: "1 Tê-sa-lô-ni-ca" },
  { code: "2 Tê", name: "2 Tê-sa-lô-ni-ca" },
  { code: "1 Ti", name: "1 Ti-mô-thê" },
  { code: "2 Ti", name: "2 Ti-mô-thê" },
  { code: "Tít", name: "Tít" },
  { code: "Philm", name: "Phi-lê-môn" },
  { code: "Hê", name: "Hê-bơ-rơ" },
  { code: "Gia", name: "Gia-cơ" },
  { code: "1 Phi", name: "1 Phi-e-rơ" },
  { code: "2 Phi", name: "2 Phi-e-rơ" },
  { code: "1 Gi", name: "1 Giăng" },
  { code: "2 Gi", name: "2 Giăng" },
  { code: "3 Gi", name: "3 Giăng" },
  { code: "Giu", name: "Giu-đe" },
  { code: "Khải", name: "Khải Thị" }
];
