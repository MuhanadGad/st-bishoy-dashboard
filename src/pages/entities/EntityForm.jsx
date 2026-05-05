import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Input, Select, Space, Spin, Typography, message } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { createEntity, fetchEntity, updateEntity, clearCurrentEntity } from '@/store/entitiesSlice';
import { fetchTags } from '@/store/tagsSlice';

const { Title } = Typography;
const { Option } = Select;

const entityCategories = ['diocese', 'monastery', 'organization'];

const EntityForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const isEditing = Boolean(slug);
  const { currentEntity, loading, creating, updating, error } = useSelector((state) => state.entities);
  const { tags, loading: tagsLoading } = useSelector((state) => state.tags);

  useEffect(() => {
    dispatch(fetchTags({ category: 'entity', page: 1, limit: 1000 }));

    if (isEditing && slug) {
      dispatch(fetchEntity(slug));
    }

    return () => {
      dispatch(clearCurrentEntity());
    };
  }, [dispatch, isEditing, slug]);

  useEffect(() => {
    if (!isEditing || !currentEntity) return;

    form.setFieldsValue({
      name: currentEntity.name || '',
      category: currentEntity.category || undefined,
      tagIds: currentEntity.tags?.map((tag) => tag.id) || [],
    });
  }, [currentEntity, form, isEditing]);

  useEffect(() => {
    if (!error) return;
    message.error(isEditing ? t('entities.updateError') : t('entities.createError'));
  }, [error, isEditing, t]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        category: values.category,
        tagIds: values.tagIds || [],
      };

      if (isEditing) {
        await dispatch(updateEntity({ id: currentEntity?.id, data: payload })).unwrap();
        message.success(t('entities.updateSuccess'));
        navigate(`/entities/${currentEntity?.slug || slug}`);
        return;
      }

      const createdEntity = await dispatch(createEntity(payload)).unwrap();
      message.success(t('entities.createSuccess'));
      navigate(`/entities/${createdEntity?.slug || createdEntity?.id}`);
    } catch (submitError) {
      if (submitError?.errorFields) return;
      message.error(isEditing ? t('entities.updateError') : t('entities.createError'));
    }
  };

  const isPageLoading = isEditing && loading && !currentEntity;

  if (isPageLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(isEditing ? `/entities/${slug}` : '/entities')}>
            {t('common.back')}
          </Button>
          <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HomeOutlined style={{ color: '#5C1A1B' }} />
            {isEditing ? t('entities.edit') : t('entities.create')}
          </Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ maxWidth: '780px' }}>
          <Form.Item
            name="name"
            label={t('entities.name')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Input placeholder={t('entities.namePlaceholder')} size="large" />
          </Form.Item>

          <Form.Item
            name="category"
            label={t('entities.category')}
            rules={[{ required: true, message: t('validation.required') }]}
          >
            <Select placeholder={t('entities.selectCategory')} size="large">
              {entityCategories.map((category) => (
                <Option key={category} value={category}>
                  {t(`entities.${category}`)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tagIds" label={t('entities.tags')}>
            <Select
              mode="multiple"
              placeholder={t('entities.selectTags')}
              loading={tagsLoading}
              optionFilterProp="label"
              size="large"
              options={(tags || []).map((tag) => ({
                label: tag.name || tag.slug,
                value: tag.id,
              }))}
            />
          </Form.Item>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={creating || updating}
                size="large"
              >
                {isEditing ? t('common.update') : t('common.create')}
              </Button>
              <Button onClick={() => navigate(isEditing ? `/entities/${slug}` : '/entities')} size="large">
                {t('common.cancel')}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EntityForm;
