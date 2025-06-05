import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import './WheelSection.css';

interface WheelItem {
  id: number;
  title: string;
  subTitle: string;
  icon: string;
}

const ITEMS: WheelItem[] = [
  {
    id: 1,
    title: "Web",
    subTitle: "홈페이지부터 웹디자인까지 맞춤형 서비스를 제공 합니다.",
    icon: ""
  },
  {
    id: 2,
    title: "Contents Marketing",
    subTitle: "기업주가 아닌 소비자 시각으로 서비스를 재해석해서 효과적인 마케팅을합니다.",
    icon: ""
  },
  {
    id: 3,
    title: "Video/CF",
    subTitle: "유튜브 영상부터 광고영상의 기획부터 제작까지 잘팔리는 영상을 제작합니다.",
    icon: ""
  },
  {
    id: 4,
    title: "NAVER",
    subTitle: "국내 1위 플랫폼에서 글과 사진으로 서비스 가치를 효율적으로 올립니다.",
    icon: ""
  },
  {
    id: 5,
    title: "Aerial Contents",
    subTitle: "전문적인 항공촬영으로 특별한 시각의 영상 또는 사진을 제공합니다.",
    icon: ""
  }
];

const WheelSection: React.FC = () => {
  return (
    <div className="w-full h-screen bg-white flex flex-col md:flex-row">
      {/* 우측 영역 - 모바일에서는 상단에 표시 */}
      <div className="w-full md:w-1/2 h-[30vh] md:h-full bg-gray-100 md:order-last">
        {/* 추후 이미지나 다른 콘텐츠 추가 */}
      </div>

      {/* 좌측 영역 - 모바일에서는 전체 폭 사용 */}
      <div className="w-full md:w-1/2 h-[70vh] md:h-full flex flex-col relative px-6 md:px-20">
        {/* 고정 텍스트 */}
        <h2 className="text-5xl font-bold mt-20">
          <span className="text-[#2DD4BF]">알리다</span>에선<br />
          이런 일을 합니다.
        </h2>

        {/* Swiper 컨테이너 */}
        <div className="flex-1 relative overflow-hidden mt-20">
          <Swiper
            direction="vertical"
            slidesPerView={3}
            spaceBetween={40}
            centeredSlides={true}
            loop={true}
            speed={1000}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              reverseDirection: true
            }}
            modules={[Autoplay]}
            className="!h-[400px] md:!h-[500px]"
          >
            {ITEMS.map((item) => (
              <SwiperSlide key={item.id} className="h-auto">
                <div className="tbox">
                  <div className="title-box">
                    <div className="icon">
                      <img src={item.icon} alt={item.title} />
                    </div>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className="arrow">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <p className="description text-base font-bold">{item.subTitle}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default WheelSection;