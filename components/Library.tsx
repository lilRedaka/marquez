import React, { useEffect, useState } from 'react';
import { Spin, List, Button } from 'antd';
import { Novel } from '@/lib/db';

const Library: React.FC<{ newNovel: () => Promise<void> }> = ({ newNovel }) => {
    const [novels, setNovels] = useState<Novel[]>([]);
    const [listLoading, setListLoading] = useState(true);

    useEffect(() => {
        const fetchNovels = async () => {
            try {
                const response = await fetch('/api/novels');
                const data = await response.json();
                setNovels(data.novels);
            } catch (error) {
                console.error('Error fetching novels:', error);
            } finally {
                setListLoading(false);
            }
        };

        fetchNovels();
    }, []);

    return (
        <div className=' flex flex-col'>
            <div className=' flex flex-row-reverse'>
                <Button type="primary" onClick={newNovel}>Add Novel</Button>
            </div>
            <>
                {listLoading ? (
                    <Spin />
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={novels}
                        renderItem={novel => (
                            <List.Item>
                                <List.Item.Meta
                                    title={novel.title}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </>
        </div>
    );
};

export default Library;