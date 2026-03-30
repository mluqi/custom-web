import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import SEO from "../../components/common/SEO";

const PrivacyPolicyPage = () => {
  const { t } = useLanguage();

  const sections = [
    {
      title: t("privacyPolicy.sections.intro.title"),
      content: t("privacyPolicy.sections.intro.content"),
    },
    {
      title: t("privacyPolicy.sections.consent.title"),
      content: t("privacyPolicy.sections.consent.content"),
    },
    {
      title: t("privacyPolicy.sections.infoCollected.title"),
      content: t("privacyPolicy.sections.infoCollected.content"),
    },
    {
      title: t("privacyPolicy.sections.usage.title"),
      isList: true,
      items: t("privacyPolicy.sections.usage.items"),
    },
    {
      title: t("privacyPolicy.sections.logFiles.title"),
      content: t("privacyPolicy.sections.logFiles.content"),
    },
    {
      title: t("privacyPolicy.sections.cookies.title"),
      content: t("privacyPolicy.sections.cookies.content"),
    },
    {
      title: t("privacyPolicy.sections.advertising.title"),
      content: t("privacyPolicy.sections.advertising.content"),
    },
    {
      title: t("privacyPolicy.sections.thirdParty.title"),
      content: t("privacyPolicy.sections.thirdParty.content"),
    },
    {
      title: t("privacyPolicy.sections.ccpa.title"),
      content: t("privacyPolicy.sections.ccpa.content"),
    },
    {
      title: t("privacyPolicy.sections.gdpr.title"),
      isList: true,
      items: t("privacyPolicy.sections.gdpr.items"),
    },
    {
      title: t("privacyPolicy.sections.children.title"),
      content: t("privacyPolicy.sections.children.content"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-16">
      <SEO
        title={`${t("privacyPolicy.title")} | NAT`}
        description={t("privacyPolicy.sections.intro.content")}
        url={window.location.href}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
            {t("privacyPolicy.title")}
          </h1>
          <p className="text-gray-600">{t("privacyPolicy.lastUpdated")}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-10 space-y-6 md:space-y-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                {section.title}
              </h2>

              {section.isList ? (
                <ul className="space-y-2 ml-6">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="text-gray-700 list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
