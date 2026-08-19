import { prisma as db } from '../../db';
import { CreateProductInput } from './marketplace.validation';
import { AppError } from '../../errors/AppError';
import { sendMarketplaceApprovalEmail } from '../../utils/emailService';

export const getAllProducts = async (category?: string, status?: string, page?: number, limit?: number) => {
  const whereClause: any = {};
  if (category) {
    whereClause.category = category;
  }
  if (status) {
    const upperStatus = status.toUpperCase();
    if (upperStatus !== 'ALL') {
      whereClause.status = upperStatus;
    }
  } else {
    whereClause.status = 'APPROVED';
  }

  const take = limit && limit > 0 ? limit : undefined;
  const skip = page && limit && page > 0 ? (page - 1) * limit : undefined;

  return db.marketplaceProduct.findMany({
    where: whereClause,
    take,
    skip,
    orderBy: { createdAt: 'desc' }
  });
};

export const getProductById = async (id: string) => {
  const product = await db.marketplaceProduct.findUnique({ where: { id } });
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const createProduct = async (data: CreateProductInput & { status?: any }) => {
  return db.marketplaceProduct.create({ data });
};

export const updateProduct = async (id: string, data: Partial<CreateProductInput> & { status?: any }) => {
  await getProductById(id);
  return db.marketplaceProduct.update({
    where: { id },
    data,
  });
};

export const approveProductWithEmail = async (id: string) => {
  const product = await getProductById(id);

  const isValidEmail = (e?: string | null): boolean => {
    if (!e) return false;
    const trimmed = e.trim().toLowerCase();
    if (trimmed.endsWith('@example.com') || trimmed.endsWith('@test.com') || trimmed.includes('contributor@example.com')) return false;
    return trimmed.includes('@') && trimmed.includes('.');
  };

  const targetEmail = isValidEmail(product.email) ? product.email : null;

  if (product.status === 'APPROVED' && product.approvalEmailSent) {
    return {
      product,
      emailStatus: 'ALREADY_SENT',
      message: `Product already approved and notification email already sent to ${targetEmail || 'seller'}.`,
      recipientEmail: targetEmail,
    };
  }

  const now = new Date();
  const updatedProduct = await db.marketplaceProduct.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedAt: product.approvedAt || now,
    },
  });

  if (!targetEmail) {
    return {
      product: updatedProduct,
      emailStatus: 'NO_USER_EMAIL',
      message: 'Product approved, but no valid seller email address was found in the submission form.',
      recipientEmail: null,
    };
  }

  const emailResult = await sendMarketplaceApprovalEmail({
    to: targetEmail,
    sellerName: updatedProduct.businessName || 'Artisan Partner',
    businessName: updatedProduct.businessName,
    productName: updatedProduct.productName,
  });

  if (emailResult.success) {
    const finalProduct = await db.marketplaceProduct.update({
      where: { id },
      data: {
        approvalEmailSent: true,
        approvalEmailSentAt: now,
      },
    });

    return {
      product: finalProduct,
      emailStatus: 'SENT',
      message: `Product approved ✓ Notification email sent to ${targetEmail}`,
      recipientEmail: targetEmail,
    };
  } else {
    return {
      product: updatedProduct,
      emailStatus: 'FAILED',
      message: `Product approved, but notification email delivery failed: ${emailResult.error || 'SMTP delivery error'}`,
      recipientEmail: targetEmail,
    };
  }
};

export const approveProduct = async (id: string) => {
  const result = await approveProductWithEmail(id);
  return result.product;
};

export const rejectProduct = async (id: string) => {
  await getProductById(id);
  return db.marketplaceProduct.update({
    where: { id },
    data: { status: 'REJECTED' },
  });
};

export const deleteProduct = async (id: string) => {
  await getProductById(id);
  return db.marketplaceProduct.delete({ where: { id } });
};
