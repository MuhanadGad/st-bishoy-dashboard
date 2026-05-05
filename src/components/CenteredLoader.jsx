import { Spin } from "antd";
import { useTranslation } from "react-i18next";

export default function CenteredLoader({
  fullScreen = false,
  minHeight = 320,
  size = "large",
}) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: fullScreen ? "100vh" : minHeight,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spin size={size} />
    </div>
  );
}
