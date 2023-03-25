import * as Story from "./index.stories";
import { globalDecorator } from "../../../../../.storybook/preview";

const getStringFromArray = (orderItem, selector) => {
  return orderItem
    .find(selector)
    .props()
    .children.join("")
    .trim();
};
describe("<PageOrderList />", () => {
  it("noOrders", async () => {
    const wrapper = mount(globalDecorator(Story.noOrders));
    expect(wrapper.find(".OrderItem").exists()).toBe(false);

    expect(wrapper.find('[data-test="order-noOrders"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="order-noOrders"]').props().children).toBe(
      "У вас еще нет заказов"
    );
    // проверяем что нет заказов, есть текст "У вас еще нет заказов"
  });

  it.skip("videoOrders", async () => {
    const wrapper = mount(globalDecorator(Story.videoOrders));
    const orderItem = wrapper.find(".OrderItem").at(0);
    // проверяем текст на кнопке товара "перейти к видео"

    console.log(orderItem.find(".VideoProduct"));

    expect(orderItem.find(".VideoProduct")).toBe("Перейти к видео");
  });

  it("canceledOrders", async () => {
    const wrapper = mount(globalDecorator(Story.canceledOrders));
    const orderItem = wrapper.find(".OrderItem").at(0);

    expect(orderItem.find('[data-test="order-status"]').props().children).toBe(
      "Отменен"
    );
    // проверяем статус заказа "отменен"
  });

  it("acceptedOrders", async () => {
    const wrapper = mount(globalDecorator(Story.acceptedOrders));

    const orderItem = wrapper.find(".OrderItem").at(0);

    expect(orderItem.find('[data-test="order-status"]').props().children).toBe(
      "Принят"
    );
    // проверяем статус заказа "принят"
  });

  it("withNoteOrders", async () => {
    const wrapper = mount(globalDecorator(Story.withNoteOrders));

    const orderItem = wrapper.find(".OrderItem").at(0);
    const note = orderItem.find('[data-test="order-note"]');
    expect(note.exists()).toBe(true);
    expect(note.props().children).toBe(
      "Но если вы заполните квиз - я обещаю развеселиться в компании отличных натуральных уходовых средств. Но если вы заполните квиз - я обещаю развеселиться в компании отличных натуральных уходовых средств."
    );
    // проверяем комментарий заказа
  });

  it("withVideos", async () => {
    const wrapper = mount(globalDecorator(Story.withVideos));

    const video = wrapper.find(".componentVideo");
    const videoCards = video.find(".ComponentVideoCard");
    expect(video.exists()).toBe(true);
    expect(videoCards.length).toBe(5);
    // проверяем комментарий заказа
  });
});
