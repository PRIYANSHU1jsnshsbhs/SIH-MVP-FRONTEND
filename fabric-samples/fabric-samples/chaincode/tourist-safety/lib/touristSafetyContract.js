'use strict';

const { Contract } = require('fabric-contract-api');

class TouristSafetyContract extends Contract {

    // ============================================================================
    // REGISTRATION FUNCTION (for Register Button)
    // ============================================================================

    async registerTourist(ctx, touristData) {
        try {
            const tourist = JSON.parse(touristData);
            
            // Validate required fields
            if (!tourist.id || !tourist.name || !tourist.email) {
                throw new Error('Missing required fields: id, name, or email');
            }

            // Check if tourist already exists
            const existingTourist = await this.getTourist(ctx, tourist.id);
            if (existingTourist) {
                throw new Error(`Tourist with ID ${tourist.id} already exists`);
            }

            // Set defaults and timestamps
            const txTimestamp = ctx.stub.getTxTimestamp();
            const now = new Date(txTimestamp.seconds * 1000).toISOString();
            const registeredTourist = {
                id: tourist.id,
                name: tourist.name,
                email: tourist.email,
                phone: tourist.phone || '',
                nationality: tourist.nationality || '',
                passportNumber: tourist.passportNumber || '',
                emergencyContacts: tourist.emergencyContacts || [],
                digitalId: `DID_${tourist.id}_${txTimestamp.seconds}`,
                safetyScore: 75,
                status: 'active',
                isDeleted: false,
                createdAt: now,
                updatedAt: now
            };

            // Store on blockchain
            const touristKey = `TOURIST_${tourist.id}`;
            await ctx.stub.putState(touristKey, Buffer.from(JSON.stringify(registeredTourist)));

            console.log(`Tourist registered successfully: ${tourist.id}`);
            return registeredTourist;

        } catch (error) {
            throw new Error(`Failed to register tourist: ${error.message}`);
        }
    }

    // ============================================================================
    // SOS ALERT FUNCTION (for SOS Button)
    // ============================================================================

    async createSOSAlert(ctx, alertData) {
        try {
            const alert = JSON.parse(alertData);
            
            // Validate required fields
            if (!alert.id || !alert.touristId) {
                throw new Error('Missing required fields: id or touristId');
            }

            // Verify tourist exists
            const tourist = await this.getTourist(ctx, alert.touristId);
            if (!tourist) {
                throw new Error(`Tourist not found: ${alert.touristId}`);
            }

            // Create SOS alert
            const txTimestamp = ctx.stub.getTxTimestamp();
            const now = new Date(txTimestamp.seconds * 1000).toISOString();
            const sosAlert = {
                id: alert.id,
                touristId: alert.touristId,
                type: 'panic',
                severity: 'critical',
                status: 'open',
                title: 'SOS Emergency Alert',
                description: alert.description || 'Emergency SOS button pressed',
                location: alert.location || {},
                timestamp: now,
                createdAt: now,
                updatedAt: now,
                // Email/SMS notification flags
                notificationSent: false,
                recipients: alert.recipients || [] // Your test emails/phones
            };

            // Store alert on blockchain
            const alertKey = `ALERT_${alert.id}`;
            await ctx.stub.putState(alertKey, Buffer.from(JSON.stringify(sosAlert)));

            // TODO: Trigger email/SMS notifications here
            // This would integrate with external notification service
            console.log(`SOS Alert created: ${alert.id} for tourist: ${alert.touristId}`);
            console.log(`Notification should be sent to: ${JSON.stringify(sosAlert.recipients)}`);

            return sosAlert;

        } catch (error) {
            throw new Error(`Failed to create SOS alert: ${error.message}`);
        }
    }

    // ============================================================================
    // e-FIR FUNCTION (for Online Form)
    // ============================================================================

    async generateEFIR(ctx, efirData) {
        try {
            const efir = JSON.parse(efirData);
            
            // Validate required fields
            if (!efir.id || !efir.touristId || !efir.incidentType) {
                throw new Error('Missing required fields: id, touristId, or incidentType');
            }

            // Verify tourist exists
            const tourist = await this.getTourist(ctx, efir.touristId);
            if (!tourist) {
                throw new Error(`Tourist not found: ${efir.touristId}`);
            }

            // Create e-FIR
            const txTimestamp = ctx.stub.getTxTimestamp();
            const now = new Date(txTimestamp.seconds * 1000).toISOString();
            const generatedEFIR = {
                id: efir.id,
                firNumber: `FIR_${efir.id}_${txTimestamp.seconds}`,
                touristId: efir.touristId,
                incidentType: efir.incidentType,
                incidentDate: efir.incidentDate || now,
                location: efir.location || {},
                description: efir.description || '',
                reportedBy: efir.reportedBy || tourist.name,
                officerInCharge: efir.officerInCharge || '',
                policeStation: efir.policeStation || '',
                status: 'filed',
                evidence: efir.evidence || [],
                witnesses: efir.witnesses || [],
                documentHash: this.generateHash(efir.id + txTimestamp.seconds),
                createdAt: now,
                updatedAt: now,
                // Notification settings
                notificationSent: false,
                authorityContacts: efir.authorityContacts || [] // Your test emails/phones
            };

            // Store e-FIR on blockchain
            const efirKey = `EFIR_${efir.id}`;
            await ctx.stub.putState(efirKey, Buffer.from(JSON.stringify(generatedEFIR)));

            // TODO: Send e-FIR notification to authorities
            console.log(`e-FIR generated: ${generatedEFIR.firNumber} for tourist: ${efir.touristId}`);
            console.log(`Notification should be sent to: ${JSON.stringify(generatedEFIR.authorityContacts)}`);

            return generatedEFIR;

        } catch (error) {
            throw new Error(`Failed to generate e-FIR: ${error.message}`);
        }
    }

    // ============================================================================
    // DELETE ACCOUNT FUNCTION (for User Profile)
    // ============================================================================

    async deleteTourist(ctx, touristId) {
        try {
            // Get existing tourist
            const tourist = await this.getTourist(ctx, touristId);
            if (!tourist) {
                throw new Error(`Tourist not found: ${touristId}`);
            }

            // Perform soft delete
            tourist.isDeleted = true;
            tourist.status = 'inactive';
            const txTimestamp = ctx.stub.getTxTimestamp();
            tourist.updatedAt = new Date(txTimestamp.seconds * 1000).toISOString();

            // Update on blockchain
            const touristKey = `TOURIST_${touristId}`;
            await ctx.stub.putState(touristKey, Buffer.from(JSON.stringify(tourist)));

            console.log(`Tourist account deleted: ${touristId}`);
            return { success: true, message: 'Account deleted successfully' };

        } catch (error) {
            throw new Error(`Failed to delete tourist account: ${error.message}`);
        }
    }

    // ============================================================================
    // HELPER FUNCTIONS
    // ============================================================================

    async getTourist(ctx, touristId) {
        try {
            const touristKey = `TOURIST_${touristId}`;
            const touristBytes = await ctx.stub.getState(touristKey);
            
            if (!touristBytes || touristBytes.length === 0) {
                return null;
            }

            const tourist = JSON.parse(touristBytes.toString());
            
            // Don't return deleted tourists
            if (tourist.isDeleted) {
                return null;
            }

            return tourist;

        } catch (error) {
            console.log(`Error getting tourist: ${error.message}`);
            return null;
        }
    }

    async getAlert(ctx, alertId) {
        try {
            const alertKey = `ALERT_${alertId}`;
            const alertBytes = await ctx.stub.getState(alertKey);
            
            if (!alertBytes || alertBytes.length === 0) {
                return null;
            }

            return JSON.parse(alertBytes.toString());

        } catch (error) {
            console.log(`Error getting alert: ${error.message}`);
            return null;
        }
    }

    async getEFIR(ctx, efirId) {
        try {
            const efirKey = `EFIR_${efirId}`;
            const efirBytes = await ctx.stub.getState(efirKey);
            
            if (!efirBytes || efirBytes.length === 0) {
                return null;
            }

            return JSON.parse(efirBytes.toString());

        } catch (error) {
            console.log(`Error getting e-FIR: ${error.message}`);
            return null;
        }
    }

    // Simple hash function for document integrity
    generateHash(input) {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // ============================================================================
    // TESTING/DEBUG FUNCTIONS
    // ============================================================================

    async getAllTourists(ctx) {
        try {
            const startKey = 'TOURIST_';
            const endKey = 'TOURIST_zzz';
            
            const iterator = await ctx.stub.getStateByRange(startKey, endKey);
            const tourists = [];

            while (true) {
                const result = await iterator.next();
                
                if (result.value && result.value.value.toString()) {
                    const tourist = JSON.parse(result.value.value.toString());
                    if (!tourist.isDeleted) {
                        tourists.push(tourist);
                    }
                }

                if (result.done) {
                    await iterator.close();
                    break;
                }
            }

            return tourists;

        } catch (error) {
            throw new Error(`Failed to get all tourists: ${error.message}`);
        }
    }

    async getAllAlerts(ctx) {
        try {
            const startKey = 'ALERT_';
            const endKey = 'ALERT_zzz';
            
            const iterator = await ctx.stub.getStateByRange(startKey, endKey);
            const alerts = [];

            while (true) {
                const result = await iterator.next();
                
                if (result.value && result.value.value.toString()) {
                    const alert = JSON.parse(result.value.value.toString());
                    alerts.push(alert);
                }

                if (result.done) {
                    await iterator.close();
                    break;
                }
            }

            return alerts;

        } catch (error) {
            throw new Error(`Failed to get all alerts: ${error.message}`);
        }
    }

    async getAllEFIRs(ctx) {
        try {
            const startKey = 'EFIR_';
            const endKey = 'EFIR_zzz';
            
            const iterator = await ctx.stub.getStateByRange(startKey, endKey);
            const efirs = [];

            while (true) {
                const result = await iterator.next();
                
                if (result.value && result.value.value.toString()) {
                    const efir = JSON.parse(result.value.value.toString());
                    efirs.push(efir);
                }

                if (result.done) {
                    await iterator.close();
                    break;
                }
            }

            return efirs;

        } catch (error) {
            throw new Error(`Failed to get all e-FIRs: ${error.message}`);
        }
    }
}

module.exports = TouristSafetyContract;
