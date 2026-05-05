import { Button, Space, Typography, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Text } = Typography;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

export default function Base64ImageUpload({
  value,
  onChange,
  buttonLabel,
  emptyLabel,
  removeLabel,
  errorLabel,
  accept = 'image/*',
}) {
  const handleBeforeUpload = async (file) => {
    try {
      const base64 = await fileToBase64(file);
      onChange?.(base64);
    } catch {
      message.error(errorLabel);
    }

    return false;
  };

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      <Upload
        accept={accept}
        maxCount={1}
        showUploadList={false}
        beforeUpload={handleBeforeUpload}
      >
        <Button icon={<UploadOutlined />}>{buttonLabel}</Button>
      </Upload>
      {value ? (
        <Button
          danger
          type="text"
          onClick={() => onChange?.('')}
          style={{ paddingInline: 0, width: 'fit-content' }}
        >
          {removeLabel}
        </Button>
      ) : (
        <Text type="secondary">{emptyLabel}</Text>
      )}
    </Space>
  );
}
