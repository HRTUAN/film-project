
import { Movie, Comment } from './types';

export const GENRES = ["Hành động", "Tình cảm", "Viễn tưởng", "Kinh dị", "Hài hước", "Hoạt hình", "Phiêu lưu"];
export const COUNTRIES = ["Mỹ", "Hàn Quốc", "Việt Nam", "Nhật Bản", "Trung Quốc", "Anh"];
export const YEARS = [2024, 2023, 2022, 2021, 2020, 2019];

const STREAM_URL = "https://video.webhalong.id.vn/video.mp4";

export const MOCK_MOVIES: Movie[] = [
  {
    id: "1",
    title: "Dune: Hành Tinh Cát - Phần Hai",
    slug: "dune-part-two",
    poster: "https://picsum.photos/seed/dune1/400/600",
    banner: "https://picsum.photos/seed/dune_banner/1920/1080",
    description: "Paul Atreides hợp lực với Chani và người Fremen trong khi tìm cách trả thù những kẻ âm mưu đã phá hủy gia đình mình. Đối mặt với sự lựa chọn giữa tình yêu của đời mình và số phận của vũ trụ đã biết, anh cố gắng ngăn chặn một tương lai khủng khiếp mà chỉ anh mới có thể thấy trước.",
    year: 2024,
    duration: "2h 46m",
    country: "Mỹ",
    genres: ["Hành động", "Viễn tưởng", "Phiêu lưu"],
    rating: 8.8,
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", avatar: "https://picsum.photos/seed/tc/100/100" },
      { name: "Zendaya", role: "Chani", avatar: "https://picsum.photos/seed/zen/100/100" },
      { name: "Austin Butler", role: "Feyd-Rautha", avatar: "https://picsum.photos/seed/ab/100/100" }
    ],
    embedUrl: STREAM_URL
  },
  {
    id: "2",
    title: "Vây Hãm: Kẻ Trừng Phạt",
    slug: "the-roundup-punishment",
    poster: "https://picsum.photos/seed/roundup/400/600",
    banner: "https://picsum.photos/seed/roundup_banner/1920/1080",
    description: "Thanh tra Ma Seok-do gia nhập Đội điều tra tội phạm mạng để truy bắt Baek Chang-gi, một cựu lính đánh thuê đặc nhiệm điều hành một tổ chức đánh bạc trực tuyến bất hợp pháp.",
    year: 2024,
    duration: "1h 49m",
    country: "Hàn Quốc",
    genres: ["Hành động", "Tội phạm"],
    rating: 7.5,
    cast: [
      { name: "Ma Dong-seok", role: "Ma Seok-do", avatar: "https://picsum.photos/seed/mds/100/100" },
      { name: "Kim Mu-yeol", role: "Baek Chang-gi", avatar: "https://picsum.photos/seed/kmy/100/100" }
    ],
    embedUrl: STREAM_URL
  },
  {
    id: "3",
    title: "Mai",
    slug: "mai-movie",
    poster: "https://picsum.photos/seed/mai/400/600",
    banner: "https://picsum.photos/seed/mai_banner/1920/1080",
    description: "Câu chuyện về Mai, một người phụ nữ gần 40 tuổi làm nghề massage, đang phải đối mặt với những khó khăn trong cuộc sống và tình yêu bất ngờ với một chàng trai trẻ tuổi hơn.",
    year: 2024,
    duration: "2h 11m",
    country: "Việt Nam",
    genres: ["Tình cảm", "Tâm lý"],
    rating: 7.2,
    cast: [
      { name: "Phương Anh Đào", role: "Mai", avatar: "https://picsum.photos/seed/pad/100/100" },
      { name: "Tuấn Trần", role: "Dương", avatar: "https://picsum.photos/seed/tt/100/100" }
    ],
    embedUrl: STREAM_URL
  },
  {
    id: "4",
    title: "Godzilla x Kong: Đế Chế Mới",
    slug: "godzilla-x-kong",
    poster: "https://picsum.photos/seed/gxk/400/600",
    banner: "https://picsum.photos/seed/gxk_banner/1920/1080",
    description: "Hai thực thể cổ đại, Godzilla và Kong, đối đầu trong một trận chiến hoành tráng khi con người khám phá nguồn gốc của họ và mối liên kết với những bí ẩn của Đảo Đầu lâu.",
    year: 2024,
    duration: "1h 55m",
    country: "Mỹ",
    genres: ["Hành động", "Viễn tưởng"],
    rating: 6.8,
    cast: [
      { name: "Rebecca Hall", role: "Dr. Ilene Andrews", avatar: "https://picsum.photos/seed/rh/100/100" },
      { name: "Dan Stevens", role: "Trapper", avatar: "https://picsum.photos/seed/ds/100/100" }
    ],
    embedUrl: STREAM_URL
  },
  {
    id: "5",
    title: "Kung Fu Panda 4",
    slug: "kung-fu-panda-4",
    poster: "https://picsum.photos/seed/panda/400/600",
    banner: "https://picsum.photos/seed/panda_banner/1920/1080",
    description: "Po được chọn để trở thành Thủ lĩnh tinh thần của Thung lũng Hòa bình và cần tìm và huấn luyện một Hiệp sĩ Rồng mới, trong khi một phù thủy độc ác âm mưu triệu hồi tất cả những kẻ thù mà Po đã đánh bại.",
    year: 2024,
    duration: "1h 34m",
    country: "Mỹ",
    genres: ["Hoạt hình", "Hài hước", "Hành động"],
    rating: 7.0,
    cast: [
      { name: "Jack Black", role: "Po (voice)", avatar: "https://picsum.photos/seed/jb/100/100" },
      { name: "Awkwafina", role: "Zhen (voice)", avatar: "https://picsum.photos/seed/awk/100/100" }
    ],
    embedUrl: STREAM_URL
  },
  {
    id: "6",
    title: "Exhuma: Quật Mộ Trùng Tang",
    slug: "exhuma",
    poster: "https://picsum.photos/seed/exhuma/400/600",
    banner: "https://picsum.photos/seed/exhuma_banner/1920/1080",
    description: "Sau khi chịu đựng một loạt các sự kiện siêu nhiên kỳ quái, một gia đình giàu có sống ở Los Angeles đã triệu tập một cặp pháp sư trẻ đang nổi để cứu đứa con mới chào đời của họ.",
    year: 2024,
    duration: "2h 14m",
    country: "Hàn Quốc",
    genres: ["Kinh dị", "Giật gân"],
    rating: 7.3,
    cast: [
      { name: "Choi Min-sik", role: "Sang-deok", avatar: "https://picsum.photos/seed/cms/100/100" },
      { name: "Kim Go-eun", role: "Hwa-rim", avatar: "https://picsum.photos/seed/kge/100/100" }
    ],
    embedUrl: STREAM_URL
  }
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    user: "Hoàng Long",
    avatar: "https://picsum.photos/seed/u1/40/40",
    content: "Phim quá đỉnh, hình ảnh và âm thanh thực sự tuyệt vời. Một trải nghiệm điện ảnh đúng nghĩa!",
    timestamp: "2 giờ trước"
  },
  {
    id: "c2",
    user: "Minh Anh",
    avatar: "https://picsum.photos/seed/u2/40/40",
    content: "Diễn xuất của Timothée ngày càng tiến bộ. Rất đáng xem.",
    timestamp: "5 giờ trước"
  },
  {
    id: "c3",
    user: "Trần Bảo",
    avatar: "https://picsum.photos/seed/u3/40/40",
    content: "Mình đã xem đi xem lại 3 lần rồi vẫn thấy hay.",
    timestamp: "1 ngày trước"
  }
];