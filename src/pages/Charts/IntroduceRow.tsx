import { Col, Row } from 'antd';
const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const IntroduceRow = () => (
  <Row gutter={24}>
    <Col {...topColResponsiveProps} />
  </Row>
);

export default IntroduceRow;
