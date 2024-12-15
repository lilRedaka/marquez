import { useEffect, useState } from 'react';
import { Button, Input, Form, Spin, Typography, FormInstance, Space } from 'antd';
import { Novel } from '@/lib/db';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface NovelFormProps {
    onGenerate: (id: number, characters: string, environment: string, plot: string) => void;
    handleSave: (id: number) => void;
    novelId: number,
    initData?: Novel;
    form: FormInstance<{
        title: string;
        characters: string;
        environment: string;
        plot: string;
    }>
}

export default function NovelForm({ onGenerate, handleSave, novelId, initData, form }: NovelFormProps) {
    const handleGenerate = async () => {
        const formData = form.getFieldsValue();
        await onGenerate(novelId, formData.characters, formData.environment, formData.plot);
    };

    useEffect(() => {
        console.log("initData", initData)
        if (initData) {
            form.setFieldsValue({
                title: initData.title,
                characters: initData.characters,
                environment: initData.environment,
                plot: initData.plot,
            });
        }
    }, [])

    return (
        <div>
            <Form form={form} layout="vertical">
                <Form.Item name="title" label="Title">
                    <Input />
                </Form.Item>
                <Form.Item name="characters" label="Characters">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="environment" label="Environment">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item name="plot" label="Plot">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" onClick={() => handleSave(novelId)}>Save</Button>
                        <Button onClick={handleGenerate}>生成</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}