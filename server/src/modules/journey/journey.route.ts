import { Router } from 'express';
import * as journeyController from './journey.controller';
import { authenticate, restrictTo } from '../../middlewares/auth.middleware';

const router = Router();

// Admin routes (Defined first to prevent shadowing by /:id wildcard)
router.get('/admin/all', authenticate, restrictTo('ADMIN'), journeyController.getAllJourneys);
router.patch('/:id/approve', authenticate, restrictTo('ADMIN'), journeyController.approveJourney);
router.patch('/:id/reject', authenticate, restrictTo('ADMIN'), journeyController.rejectJourney);
router.delete('/:id', authenticate, restrictTo('ADMIN'), journeyController.deleteJourney);

// Public routes
router.get('/', journeyController.getApprovedJourneys);
router.get('/:id', journeyController.getJourneyById);

// Authenticated user routes
router.use(authenticate);
router.post('/', journeyController.createJourney);
router.put('/:id', journeyController.updateJourney);
router.patch('/:id', restrictTo('ADMIN'), journeyController.updateJourney);

export const journeyRoutes = router;
