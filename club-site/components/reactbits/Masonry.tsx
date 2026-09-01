import { useState, useEffect, useMemo, useRef } from 'react';
import { useTransition, a } from '@react-spring/web';
import './Masonry.css';

interface MasonryItem {
  height: number;
  image?: string;
  [key: string]: unknown;
}

interface GridItem extends MasonryItem {
  x: number;
  y: number;
  width: number;
}

interface MasonryProps {
  data: MasonryItem[];
  keys?: string;
  columns?: number;
  gap?: number;
  height?: number;
}

const Masonry = ({
  data,
  keys = 'id',
  columns = 3,
  gap = 20,
  height = 400
}: MasonryProps) => {
  const [columnsState, setColumns] = useState(columns);
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
      if (window.matchMedia('(max-width: 600px)').matches) {
        setColumns(1);
      } else if (window.matchMedia('(max-width: 900px)').matches) {
        setColumns(2);
      } else {
        setColumns(columns);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  const [heights, gridItems] = useMemo(() => {
    const heights = new Array(columnsState).fill(0);
    const gridItems = data.map((child) => {
      const column = heights.indexOf(Math.min(...heights));
      const x = (width / columnsState) * column;
      const y = (heights[column] += child.height / 2) - child.height / 2;
      return { ...child, x, y, width: width / columnsState, height: child.height / 2 };
    });
    return [heights, gridItems];
  }, [columnsState, data, width]);

  const transitions = useTransition(gridItems, {
    key: (item: GridItem) => (item[keys] as string | number | undefined) ?? item.image ?? Math.random(),
    from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
    enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
    update: ({ x, y, width, height }) => ({ x, y, width, height }),
    leave: { height: 0, opacity: 0 },
    config: { mass: 5, tension: 500, friction: 100 },
    trail: 25,
  });

  return (
    <div ref={ref} className="masonry" style={{ height: Math.max(height, ...heights), gap }}>
      {transitions((style, item) => (
        <a.div className="masonry-item" style={style}>
          <div
            style={{
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
              borderRadius: '15px'
            }}
          />
        </a.div>
      ))}
    </div>
  );
};

export default Masonry;
