import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import ScrollButton from "./components/ScrollButton";
import SlideSection from "@/components/SlideSection";
import TypingText from "./components/TypingText";

function LandingStart() {
  return (
    <section className='flex min-h-screen flex-col items-center justify-center relative bg-white'>
      {/* 줄무늬 배경 */}
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[length:100%_32px]' />

      <div className='flex flex-col w-[415px] text-center z-10'>
        <TypingText />
        <h3 className='md:text-xl text-sm  text-black-300 lg:mb-15 md:mb-10 mb-5 font-iropke'>
          다른 사람들과 감정을 공유해 보세요.
        </h3>

        <Button
          asChild
          className='lg:w-[286px] lg:h-[64px] w-[112px] h-[48px] mx-auto'
        >
          <Link href='/main' aria-label='메인 페이지로 이동'>
            시작하기
          </Link>
        </Button>
      </div>
      <ScrollButton />
    </section>
  );
}

function LandingContent() {
  return (
    <section className='flex flex-col min-h-screen items-center relative'>
      <SlideSection direction='right'>
        <SectionComponent
          imgSrc={"/images/landing/landing01.png"}
          text1={
            <>
              명언이나 글귀, <br />
              토막 상식들을 공유해 보세요.
            </>
          }
          text2={
            <>
              나만 알던 소중한 글들을 <br />
              다른 사람들에게 전파하세요.
            </>
          }
        />
      </SlideSection>

      <SlideSection direction='left'>
        <SectionComponent
          imgSrc={"/images/landing/landing02.png"}
          text1={
            <>
              감정 상태에 따라,
              <br />
              알맞은 위로를 받을 수 있어요.
            </>
          }
          text2={<>태그를 통해 글을 모아 볼 수 있어요.</>}
          isReversed={true}
        />
      </SlideSection>
      <SlideSection direction='right'>
        <SectionComponent
          imgSrc={"/images/landing/landing03.png"}
          text1={
            <>
              내가 요즘 어떤 감정 상태인지
              <br />
              통계로 한눈에 볼 수 있어요.
            </>
          }
          text2={
            <>
              감정 달력으로
              <br />내 마음에 담긴 감정을 확인해보세요
            </>
          }
        />
      </SlideSection>
    </section>
  );
}

function LandingUserEpigram() {
  return (
    <SlideSection direction='up'>
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col lg:w-[640px] lg:h-[1056px] mt-50 mb-20'>
          <h2 className='text-[32px] font-bold text-center mb-30 text-black-950'>
            사용자들이 직접
            <br />
            인용한 에피그램들
          </h2>

          {/* sm 전용 */}
          <span className='block md:hidden relative w-[384px] h-[668px] mb-20'>
            <img
              src='/images/landing/epigram_sm.svg'
              alt='user_epigram'
              className='w-full h-full'
            />
          </span>

          {/* md 전용 */}
          <span className='hidden md:block lg:hidden relative w-[512px] h-[720px] mb-20'>
            <img
              src='/images/landing/epigram_md.svg'
              alt='user_epigram'
              className='w-full h-full'
            />
          </span>

          {/* lg 전용 */}
          <span className='hidden lg:block relative lg:w-[640px] lg:h-[788px] mb-20'>
            <img
              src='/images/landing/epigram_lg.svg'
              alt='user_epigram'
              className='w-full h-full'
            />
          </span>
        </div>
      </div>
    </SlideSection>
  );
}

function LandingEnd() {
  return (
    <div className='flex min-h-screen items-center justify-center relative bg-white'>
      {/* 줄무늬 배경 */}
      <div className='absolute inset-0 bg-[linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[length:100%_32px]' />
      <SlideSection direction='up'>
        <div className='flex flex-col w-[286px] text-center z-10'>
          <span className='relative lg:w-[184px] lg:h-[105px] w-[122px] h-[70px] lg:mb-15 mb-10 mx-auto'>
            <Image src={"/images/landing/logo_text.png"} alt='logo_text' fill />
          </span>

          <Button
            asChild
            className='lg:w-[286px] lg:h-[64px] w-[112px] h-[48px] mx-auto'
          >
            <Link href='/main' aria-label='메인 페이지로 이동'>
              시작하기
            </Link>
          </Button>
        </div>
      </SlideSection>
    </div>
  );
}

function SectionComponent({
  imgSrc,
  text1,
  text2,
  isReversed = false,
}: {
  imgSrc: string;
  text1: React.ReactNode;
  text2: React.ReactNode;
  isReversed?: boolean;
}) {
  return (
    <div
      className={`flex lg:justify-between lg:items-end ${
        isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
      } flex-col justify-between lg:w-[1188px] lg:my-[300px] my-[150px] md:w-[384px] md:h-[390px] w-[312px] h-[372px]`}
    >
      <span className='relative lg:w-[744px] lg:h-[388px] md:w-[384px] md:h-[240px] w-[312px] h-[210px] rounded-lg border overflow-hidden'>
        <Image
          src={imgSrc}
          fill
          alt='landing_image'
          style={{ objectFit: "cover" }}
        />
      </span>

      <div className='flex flex-col'>
        <h2
          className={`${
            isReversed ? "text-right" : ""
          } lg:text-[32px] text-2xl font-bold lg:mb-10 mb-5 text-black-950`}
        >
          {text1}
        </h2>
        <span
          className={`${
            isReversed ? "text-right" : ""
          } lg:text-2xl text-[16px] font-[500] text-blue-600`}
        >
          {text2}
        </span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <>
      <LandingStart />
      <LandingContent />
      <LandingUserEpigram />
      <LandingEnd />
    </>
  );
}
