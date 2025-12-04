import type { Request, Response } from "express";
import { WEBHOOK_EVENTS, HTTP_STATUS } from "../config/constants.js";
import { companyDBService } from "../services/database/company.service.js";

interface WebhookEvent {
  type: string;
  data: Record<string, unknown>;
  timestamp: number;
  company_id: string;
}

export class WebhookController {
  async handle(req: Request, res: Response): Promise<void> {
    try {
      const event = req.body as WebhookEvent;

      console.log("Webhook received:", {
        type: event.type,
        companyId: event.company_id,
        timestamp: event.timestamp,
      });

      await this.processEvent(event);

      res.status(HTTP_STATUS.OK).json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: "Failed to process webhook",
      });
    }
  }

  private async processEvent(event: WebhookEvent): Promise<void> {
    switch (event.type) {
      // Company events
      case WEBHOOK_EVENTS.COMPANY_UPDATED:
        await this.handleCompanyUpdated(event);
        break;

      case WEBHOOK_EVENTS.COMPANY_DELETED:
        await this.handleCompanyDeleted(event);
        break;

      // Order events
      case WEBHOOK_EVENTS.ORDER_CREATED:
        await this.handleOrderCreated(event);
        break;

      case WEBHOOK_EVENTS.ORDER_UPDATED:
        await this.handleOrderUpdated(event);
        break;

      // Product events
      case WEBHOOK_EVENTS.PRODUCT_CREATED:
        await this.handleProductCreated(event);
        break;

      case WEBHOOK_EVENTS.PRODUCT_UPDATED:
        await this.handleProductUpdated(event);
        break;

      // Subscription events
      case WEBHOOK_EVENTS.SUBSCRIPTION_CREATED:
        await this.handleSubscriptionCreated(event);
        break;

      case WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
        await this.handleSubscriptionUpdated(event);
        break;

      case WEBHOOK_EVENTS.SUBSCRIPTION_CANCELLED:
        await this.handleSubscriptionCancelled(event);
        break;

      // Payment events
      case WEBHOOK_EVENTS.PAYMENT_SUCCEEDED:
        await this.handlePaymentSucceeded(event);
        break;

      case WEBHOOK_EVENTS.PAYMENT_FAILED:
        await this.handlePaymentFailed(event);
        break;

      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }
  }

  // Company event handlers
  private async handleCompanyUpdated(event: WebhookEvent): Promise<void> {
    const data = event.data as {
      id: string;
      name?: string;
      description?: string;
    };
    console.log("Company updated:", data.id);

    // Update company in database
    const company = await companyDBService.findByCompanyId(data.id);
    if (company) {
      await companyDBService.updateById(data.id, {
        name: (data.name as string) || company.name,
        description: (data.description as string) || company.description,
      });
    }
  }

  private async handleCompanyDeleted(event: WebhookEvent): Promise<void> {
    const data = event.data as { id: string };
    console.log("Company deleted:", data.id);

    // Delete company from database
    try {
      await companyDBService.deleteById(data.id);
    } catch {
      console.log("Company not found in database:", data.id);
    }
  }

  // Order event handlers
  private async handleOrderCreated(event: WebhookEvent): Promise<void> {
    console.log("Order created:", event.data);
    // TODO: Implement your order creation logic
  }

  private async handleOrderUpdated(event: WebhookEvent): Promise<void> {
    console.log("Order updated:", event.data);
    // TODO: Implement your order update logic
  }

  // Product event handlers
  private async handleProductCreated(event: WebhookEvent): Promise<void> {
    console.log("Product created:", event.data);
    // TODO: Implement your product creation logic
  }

  private async handleProductUpdated(event: WebhookEvent): Promise<void> {
    console.log("Product updated:", event.data);
    // TODO: Implement your product update logic
  }

  // Subscription event handlers
  private async handleSubscriptionCreated(event: WebhookEvent): Promise<void> {
    console.log("Subscription created:", event.data);
    // TODO: Implement your subscription creation logic
  }

  private async handleSubscriptionUpdated(event: WebhookEvent): Promise<void> {
    console.log("Subscription updated:", event.data);
    // TODO: Implement your subscription update logic
  }

  private async handleSubscriptionCancelled(
    event: WebhookEvent
  ): Promise<void> {
    console.log("Subscription cancelled:", event.data);
    // TODO: Implement your subscription cancellation logic
  }

  // Payment event handlers
  private async handlePaymentSucceeded(event: WebhookEvent): Promise<void> {
    console.log("Payment succeeded:", event.data);
    // TODO: Implement your payment success logic
  }

  private async handlePaymentFailed(event: WebhookEvent): Promise<void> {
    console.log("Payment failed:", event.data);
    // TODO: Implement your payment failure logic
  }
}

export const webhookController = new WebhookController();
