import { useEffect, useRef, useState } from "react";
import ErrorMessage from "../../common/error-message";
import Loading from "../../common/loading";
import EmployeeBenefitsTabContent from "./list";
import { EmployeeBanner, EmployeeBenefitsTab, Media } from "../../../types";
import { useSearchParams } from "react-router-dom";
import EmployeeBenefitsModal from "./modal";
import { axiosPayloadClient } from "../../../utils/config";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import EmployeeBenefitsSearchResults from "./search-results";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { API_SURVEY_URL } from "../../../utils/constants";

const EmployeeBenefits = () => {
  const [tabActive, setTabActive] = useState<EmployeeBenefitsTab>();
  const [tabs, setTabs] = useState<EmployeeBenefitsTab[] | undefined>();
  const [banners, setBanners] = useState<EmployeeBanner[] | undefined>();
  const swiperRef = useRef<SwiperRef>(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchParam, setSearchParam] = useSearchParams();
  const [keywordValue, setKeywordValue] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosPayloadClient.get(
          `/api/employee-benefits-category?limit=100000&sort=id`,
        );

        if (response.status !== 200 || !response.data.docs) {
          setFormError("Error fetching contents. Please contact IT.");
        }

        setTabs([{ id: -1, name: "All" }, ...response.data.docs]);
      } catch (error) {
        setFormError(
          (error as Error)?.message || "Unknown error. Please contact IT.",
        );
      }
    };

    const fetchBanners = async () => {
      try {
        setBanners(undefined);
        const response = await axiosPayloadClient.get(
          `/api/employee-banner?limit=100000&sort=name`,
        );

        if (response.status !== 200 || !response.data.docs) {
          setFormError("Error fetching banners. Please contact IT.");
        }

        setBanners(response.data.docs);
      } catch (error) {
        setFormError(
          (error as Error)?.message || "Unknown error. Please contact IT.",
        );
      }
    };

    setContentLoading(true);

    Promise.all([fetchCategories(), fetchBanners()]).finally(() => {
      setContentLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!contentLoading && tabs) setTabActive(tabs[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs]);

  useEffect(() => {
    if (!contentLoading && tabs) {
      const activeTabId = searchParam.get("tab");
      if (activeTabId) setTabActive(tabs.find((t) => t.id === Number(activeTabId)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentLoading, searchParam]);

  useEffect(() => {
    if (tabActive) {
      const activeItemId = searchParam.get("item");

      setSearchParam({
        tab: tabActive.id.toString(),
        ...(activeItemId && { item: activeItemId }),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabActive]);

  const onClickNext = () =>
    swiperRef.current && swiperRef.current?.swiper.slideNext();

  const onClickPrev = () =>
    swiperRef.current && swiperRef.current?.swiper.slidePrev();

  return (
    <div className="flex flex-col w-full pb-8 gap-2 justify-center items-center">
      <ErrorMessage message={formError} onClose={() => setFormError("")} />

      <EmployeeBenefitsModal
        itemId={searchParam.get("item") || ""}
        contentLoading={contentLoading}
        setContentLoading={setContentLoading}
      />
      <div className="w-screen max-md:px-4 px-2 max-md:py-4 p-8 h-min flex gap-4 justify-center items-center bg-neutral  shadow-md shadow-gray-100">
        <div className="w-[720px] h-full flex flex:row justify-between items-center max-sm:flex-col max-md:items-start">
          <h1 className="text-left text-primary opacity-80 text-md max-md:text-sm">
            Employee Benefits
          </h1>
          <img
            src={`${API_SURVEY_URL}/media//do-logo-header.png`}
            alt="do-logo-header"
            className="w-36 h-auto object-contain flex max-md:w-24"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 justify-center w-full h-full max-md:px-4 px-1">
        {contentLoading && !tabs && <Loading />}

        {banners && banners.length > 0 && (
          <>
            <h5 className="text-left w-full text-gray-500 text-lg max-md:text-md">
              Featured
            </h5>
            <div className="w-full h-fit flex flex-col gap-4 relative max-md:w-screen">
              <div className="absolute flex flex-row justify-between items-center h-full w-full z-[99] pointer-events-none">
                <IoMdArrowDropleft
                  onClick={() => onClickPrev()}
                  className="pointer-events-auto text-info text-5xl max-md:text-3xl cursor-pointer"
                />
                <IoMdArrowDropright
                  onClick={() => onClickNext()}
                  className="pointer-events-auto text-info text-5xl max-md:text-3xl cursor-pointer"
                />
              </div>

              <Swiper
                ref={swiperRef}
                className="w-full aspect-video"
                slidesPerView={1}
                autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
                modules={[Navigation, Pagination, Autoplay]}
                pagination={{ clickable: true }}
                loop
              >
                {banners
                  .filter((banner) => banner._status === "published")
                  .map((banner) => {
                    return (
                      <SwiperSlide
                        key={"emp-benefits-banner_" + banner.id}
                        className="flex flex-col items-center justify-center"
                      >
                        {banner.link ? (
                          <a href={banner.link} className="w-full h-full">
                            <img
                              className="w-full h-full object-cover block"
                              src={(banner.media as Media).url}
                              alt={banner.name}
                            />
                          </a>
                        ) : (
                          <img
                            className="w-full h-full object-contain block"
                            src={(banner.media as Media).url}
                            alt={banner.name}
                          />
                        )}
                      </SwiperSlide>
                    );
                  })}
              </Swiper>
            </div>
          </>
        )}

        <h5 className="text-left w-full text-gray-500 text-lg max-md:text-md">
          Benefits
        </h5>
        <div className="flex flex-col items-center gap-4 justify-center w-full h-full max-md:px-0 px-4">
          <label className="input input-md input-bordered flex items-center gap-2 w-full">
            <input
              type="text"
              placeholder="Search"
              className="grow"
              value={keywordValue}
              onChange={(e) => setKeywordValue(e.target.value)}
            />
            {!keywordValue && <CiSearch className="text-info" />}

            {contentLoading && (
              <span className="loading loading-spinner loading-sm text-info"></span>
            )}

            {keywordValue.length > 0 && (
              <IoClose
                className="text-3xl text-info"
                onClick={() => setKeywordValue("")}
              />
            )}
          </label>

          {!keywordValue.length && (
            <>
              <div className="w-full min-h-fit box-content overflow-x-auto">
                <div className="tabs tabs-md gap-4 tabs-boxed min-w-fit max-w-full bg-gray-100 max-md:tabs-sm py-2">
                  {tabs &&
                    tabs.map((_tab, index) => {
                      return (
                        <button
                          disabled={contentLoading}
                          key={"benefits_tab" + index}
                          className={`tab ${
                            _tab.id === tabActive?.id ? "tab-active" : ""
                          }`}
                          onClick={() => setTabActive(_tab)}
                        >
                          {_tab.name}
                        </button>
                      );
                    })}
                </div>
              </div>

              {tabActive && (
                <div className="w-full h-full">
                  <EmployeeBenefitsTabContent
                    activeTab={tabActive}
                    contentLoading={contentLoading}
                    setContentLoading={setContentLoading}
                  />
                </div>
              )}
            </>
          )}

          <EmployeeBenefitsSearchResults
            keyword={keywordValue}
            contentLoading={contentLoading}
            setContentLoading={setContentLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeBenefits;
