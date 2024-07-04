import { NextFunction, Request, Response, Router } from "express";
import { createForm, getFormById, editForm, deleteForm } from "./forms.service";
import { authenticateJWT } from "../auth/auth";

const router = Router();

/**
 * @swagger
 * /api/forms/{formId}:
 *   get:
 *     summary: Get form by id
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         schema:
 *           type: string
 *         required: true
 *         example: '668574965c6feac207d2cd95'
 *     responses:
 *       200:
 *         description: Form data
 *         
 */
router.get('/forms/:formId', getFormById)


/**
 * @swagger
 * components:
 *   schemas:
 *     Form:
 *       type: object
 *       required:
 *         - title
 *         - authorId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the form
 *         title:
 *           type: string
 *           description: A title of form
 *         authorId:
 *           type: string
 *           description: Form author id
 *         fields:
 *           type: object
 *           description: Fields of form
 *         usersId:
 *           type: list
 *           description: A list of users which have access to form
 *       example:
 *         title: example form
 *         authorId: 6685584afb6aec631d074c1b
 *         fields: [
 *           { type: 'text', label: 'Your Name' },
 *           { type: 'email', label: 'Your Email' }
 *         ]
 *         usersId: [ '6686b97e299421ffef2ef121' ]
 */

/**
 * @swagger
 * /api/forms:
 *   post:
 *     summary: Create new form
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Form'
 *     responses:
 *       201:
 *         description: New form created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Form'
 *             example:
 *               id: 668569142a66a636a21a1a13
 *               title: example form
 *               authorId: 6685584afb6aec631d074c1b
 *               fields: [
 *                 { type: 'text', label: 'Your Name' },
 *                 { type: 'email', label: 'Your Email' }
 *               ]
 *               usersId: [ '6686b97e299421ffef2ef121' ]
 *       401:
 *         description: Authorization is required
 *       403:
 *         description: Invalid auth token
 *       500:
 *         description: Internal server error
 */
router.post('/forms', authenticateJWT, createForm)

/**
 * @swagger
 * /api/forms/{formId}/edit:
 *   put:
 *     summary: Update form
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         schema:
 *           type: string
 *         required: true
 *         example: '66857435198b0484afb1a302'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Form'
 *           example:
 *             userId: 6685584afb6aec631d074c1b
 *             title: Updated form
 *             fields: [
 *               { type: 'text', label: 'Your Name' },
 *               { type: 'email', label: 'Your Email' },
 *               { type: 'textarea', label: 'Your Feedback' }
 *             ]
 *             usersId: [ '6686b97e299421ffef2ef121' ]
 *     responses:
 *       200: 
 *         description: Form succesful updated 
 *       404:
 *         description: Form not found
 *       403: 
 *         description: The user does not have access
 */
router.put('/forms/:formId/edit', authenticateJWT, editForm)

/**
 * @swagger
 * /api/forms/{formId}:
 *   delete:
 *     summary: Delete form by id
 *     tags: [Forms]
 *     parameters:
 *       - in: path
 *         name: formId
 *         schema:
 *           type: string
 *         required: true
 *         example: '66857435198b0484afb1a302'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *           example:
 *             userId: 6685584afb6aec631d074c1b
 *     responses:
 *       200:
 *         description: OK  
 *       404: 
 *         description: Form not found
 *       403: 
 *         description: The user does not have access (Only authors can delete forms)
 *       
 */
router.delete('/forms/:formId', authenticateJWT, deleteForm)

export default router;