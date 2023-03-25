import * as helpers from '../helpers';
import Prometheus from './PrometheusDetox';

const prometheus = new Prometheus();

// Helper methods
prometheus.extend(helpers);

export default prometheus;
