import { getSellerLowStock } from "../clients/productServiceClient.js";
import { getSellerOrderDashboard } from "../clients/orderServiceClient.js";

/**
 * Calculate percentage change
 */
const calculatePercentageChange = (
  current = 0,
  previous = 0
) => {

  if (previous === 0) {
    if (current === 0) {
        return 0;
    }
    return 100;
  }

  return Number(
      (
        ((current - previous) / previous) * 100
      ).toFixed(1)
  );
};

/**
 * Build dashboard
 */
export const getSellerDashboard = async ({ sellerId, from, to }) => {

  const currentTo = to ? new Date(to) : new Date();
  if (to && to.length === 10) {
    currentTo.setHours(23, 59, 59, 999);
  }

  const currentFrom = from
    ? new Date(from)
    : new Date(currentTo.getTime() - 6 * 24 * 60 * 60 * 1000);

  if (from && from.length === 10) {
    currentFrom.setHours(0, 0, 0, 0);
  }

  /**
   * Previous period
   */
  const periodLength = currentTo.getTime() - currentFrom.getTime();

  const previousTo = new Date(currentFrom.getTime() - 1);

  const previousFrom = new Date(previousTo.getTime() - periodLength);

  /**
   * ==========================================
   * CALL MICROSERVICES IN PARALLEL
   * ==========================================
   */

  const [orderData, stockData] = await Promise.all([
    getSellerOrderDashboard({
      sellerId,

      from: currentFrom.toISOString(),

      to: currentTo.toISOString(),

      previousFrom: previousFrom.toISOString(),

      previousTo: previousTo.toISOString(),
    }),

    getSellerLowStock({
      sellerId,
      limit: 10,
    }),
  ]);

  const current = orderData?.data?.current || {};

  const previous = orderData?.data?.previous || {};

  /**
   * ==========================================
   * METRICS
   * ==========================================
   */

  const metrics = {
    totalOrders: current.totalOrders || 0,

    totalRevenue: Number(current.revenue || 0),

    totalProfit: Number(current.profit || 0),

    unitsSold: current.unitsSold || 0,

    returns: current.returns || 0,

    cancelled: current.cancelled || 0,
  };

  /**
   * ==========================================
   * TRENDS
   * ==========================================
   */

  const trends = {
    orders: calculatePercentageChange(
      current.totalOrders || 0,
      previous.totalOrders || 0,
    ),

    revenue: calculatePercentageChange(
      current.revenue || 0,
      previous.revenue || 0,
    ),

    profit: calculatePercentageChange(
      current.profit || 0,
      previous.profit || 0,
    ),

    unitsSold: calculatePercentageChange(
      current.unitsSold || 0,
      previous.unitsSold || 0,
    ),

    returns: calculatePercentageChange(
      current.returns || 0,
      previous.returns || 0,
    ),

    cancelled: calculatePercentageChange(
      current.cancelled || 0,
      previous.cancelled || 0,
    ),
  };

  /**
   * ==========================================
   * FINAL RESPONSE
   * ==========================================
   */

  return {
    period: {
      from: currentFrom,
      to: currentTo,

      previousFrom,
      previousTo,
    },

    metrics,

    trends,

    orderStatus: orderData?.data?.orderStatus || [],
    salesOverview: orderData?.data?.salesOverview || { chart: [] },
    recentOrders: orderData?.data?.recentOrders || [],
    topSellingProducts: orderData?.data?.topSellingProducts || [],
    lowStockProducts: stockData?.products || [],
  };
};
