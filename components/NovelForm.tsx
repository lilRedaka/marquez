import { useState } from 'react';
import { Button, Input, Form, Spin, Typography, FormInstance } from 'antd';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

interface NovelFormProps {
    onGenerate: (characters: string, environment: string, plot: string) => void;
    form: FormInstance<{
        title: string;
        characters: string;
        environment: string;
        plot: string;
    }>
}

export default function NovelForm({ onGenerate, form }: NovelFormProps) {
    const handleGenerate = () => {
        // onGenerate(characters, environment, plot);
    };

    return (
        <div>
            <Title level={1}>Marquez</Title>
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
                <Form.Item name="name" label="Plot">
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </div>
    );
}