import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Empty,
  Modal,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { clearCurrentEntity, deleteEntity, fetchEntity } from '@/store/entitiesSlice';

const { Title } = Typography;

const EntityDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t } = useTranslation();

  const { currentEntity, loading, deleting } = useSelector((state) => state.entities);

  useEffect(() => {
    if (slug) {
      dispatch(fetchEntity(slug));
    }

    return () => {
      dispatch(clearCurrentEntity());
    };
  }, [dispatch, slug]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'diocese':
        return 'purple';
      case 'monastery':
        return 'gold';
      case 'organization':
        return 'cyan';
      default:
        return 'default';
    }
  };

  const handleDeleteEntity = () => {
    Modal.confirm({
      title: t('entities.deleteConfirm'),
      content: t('entities.deleteConfirmMessage', {
        name: currentEntity?.name || currentEntity?.slug || t('common.notAvailable'),
      }),
      okText: t('common.delete'),
      okType: 'danger',
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await dispatch(deleteEntity(currentEntity.id)).unwrap();
          message.success(t('entities.deleteSuccess'));
          navigate('/entities');
        } catch (submitError) {
          message.error(t('entities.deleteError'));
        }
      },
    });
  };

  if (loading && !currentEntity) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentEntity) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <Empty description={t('entities.notFound')} />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <Space align="start" size={16}>
              <Avatar shape="square" size={64} src={currentEntity.logo} icon={<HomeOutlined />} />
              <div>
                <Space align="center" style={{ marginBottom: '12px' }}>
                  <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/entities')}>
                    {t('common.back')}
                  </Button>
                  <Title level={2} style={{ margin: 0 }}>
                    {currentEntity.name || currentEntity.slug || t('entities.title')}
                  </Title>
                </Space>
                <Tag color={getCategoryColor(currentEntity.category)}>
                  {t(`entities.${currentEntity.category}`)}
                </Tag>
              </div>
            </Space>

            <Space>
              <Button icon={<EditOutlined />} onClick={() => navigate(`/entities/${slug}/edit`)}>
                {t('common.edit')}
              </Button>
              <Button danger icon={<DeleteOutlined />} loading={deleting} onClick={handleDeleteEntity}>
                {t('common.delete')}
              </Button>
            </Space>
          </div>
        </Card>

        <Card title={t('entities.details')}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label={t('entities.name')}>
              {currentEntity.name || t('common.notAvailable')}
            </Descriptions.Item>
            <Descriptions.Item label={t('entities.slug')}>
              {currentEntity.slug || t('common.notAvailable')}
            </Descriptions.Item>
            <Descriptions.Item label={t('entities.category')}>
              {t(`entities.${currentEntity.category}`)}
            </Descriptions.Item>
            <Descriptions.Item label={t('entities.tags')}>
              {currentEntity.tags?.length ? (
                <Space size={[0, 8]} wrap>
                  {currentEntity.tags.map((tag) => (
                    <Tag color="green" key={tag.id}>
                      {tag.name || tag.slug}
                    </Tag>
                  ))}
                </Space>
              ) : (
                t('entities.noTags')
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </div>
  );
};

export default EntityDetail;
