# CPO Workflows

This guide covers common workflows for Charge Point Operators (CPOs) implementing OICP v2.3. CPOs operate charging stations and need to share station data, handle authorization requests, and report charging sessions.

## Overview of CPO Responsibilities

As a CPO, you will:
1. **Push EVSE Data** - Share charging station information with Hubject
2. **Push EVSE Status** - Update real-time availability of your stations
3. **Handle Authorization** - Respond to requests from EMPs to authorize charging
4. **Send Charging Notifications** - Report charging session progress and completion
5. **Handle Remote Operations** - Process remote start/stop and reservation requests

## Workflow 1: Push EVSE Data

### Purpose
Share static information about your charging stations with Hubject so EMPs can discover them.

### When to Use
- When adding new charging stations
- When updating station capabilities or location
- When removing stations from service
- Periodic full synchronization (recommended daily)

### Operation Details

**Operation**: `eRoamingPushEvseData`  
**Service**: eRoamingData  
**Method**: POST

### Step-by-Step Implementation

#### Step 1: Understand the Data Structure

First, explore what data you need to provide:

```
Get the schema for EvseDataRecord in CPO role
```

This shows you need to provide:
- EVSE ID (unique identifier)
- Operator ID
- Geographic coordinates
- Address information
- Charging capabilities (power, connectors)
- Payment options
- Accessibility information
- Opening hours

#### Step 2: Get Operation Details

```
Get details for eRoamingPushEvseData operation in CPO role
```

This shows:
- Endpoint path and HTTP method
- Request body structure (OperatorEvseData)
- Response format (eRoamingAcknowledgment)
- Required vs optional fields

#### Step 3: Understand Related Schemas

```
Search for schemas related to "evse" in CPO role
```

Key schemas to understand:
- **OperatorEvseData**: Container for your EVSE records
- **EvseDataRecord**: Individual charging station data
- **GeoCoordinates**: Location information
- **ChargingFacility**: Power and connector details
- **Plug**: Connector type definitions

#### Step 4: Build Your Request

Your request should include:
- Action type: "fullLoad", "update", or "insert"
- Operator ID
- Array of EVSE data records

### Example Query Flow

```
1. "Show me the structure of OperatorEvseData for CPO"
2. "What are the valid values for ChargingFacility PowerType?"
3. "What connector types are supported in the Plug schema?"
4. "Show me the eRoamingPushEvseData operation details"
```

### Best Practices

- Use "fullLoad" for initial sync or daily updates
- Use "update" for incremental changes
- Include all mandatory fields (EVSE ID, coordinates, operator ID)
- Validate connector types against the Plug enum
- Ensure geographic coordinates are accurate
- Keep data synchronized with your internal systems

---

## Workflow 2: Push EVSE Status

### Purpose
Update the real-time availability status of your charging stations.

### When to Use
- When a charging point becomes available or occupied
- When a station goes out of service
- When maintenance begins or ends
- Periodic status updates (recommended every 5-15 minutes)

### Operation Details

**Operation**: `eRoamingPushEvseStatus`  
**Service**: eRoamingEvseStatus  
**Method**: POST

### Step-by-Step Implementation

#### Step 1: Understand Status Values

```
Get the schema for EvseStatus in CPO role
```

Status values include:
- Available
- Occupied
- OutOfService
- Reserved
- Unknown

#### Step 2: Get Operation Details

```
Get details for eRoamingPushEvseStatus operation in CPO role
```

#### Step 3: Understand the Request Structure

```
What is the structure of eRoamingPushEvseStatus request body?
```

You need to provide:
- Action type: "fullLoad", "update", or "insert"
- Operator ID
- Array of EVSE status records (EVSE ID + status)

### Example Query Flow

```
1. "Show me all operations in eRoamingEvseStatus service for CPO"
2. "Get details for eRoamingPushEvseStatus in CPO"
3. "What are the valid EVSE status values?"
```

### Best Practices

- Push status changes immediately when they occur
- Use "update" for real-time status changes
- Use "fullLoad" for periodic full synchronization
- Include timestamp for status changes
- Handle network failures with retry logic
- Batch multiple status updates when possible

---

## Workflow 3: Authorization Handling

### Purpose
Respond to authorization requests from EMPs when their users want to charge at your stations.

### When to Use
- When an EV driver presents credentials at your charging station
- For both online (real-time) and offline authorization scenarios

### Operations

**Online Authorization**:
- `eRoamingAuthorizeStart` - Authorize session start
- `eRoamingAuthorizeStop` - Authorize session end

**Remote Authorization**:
- `eRoamingAuthorizeRemoteStart` - Handle remote start requests
- `eRoamingAuthorizeRemoteStop` - Handle remote stop requests

### Step-by-Step Implementation

#### Step 1: Understand Authorization Flow

```
Get all operations in eRoamingAuthorization service for CPO
```

This shows the four authorization operations you need to implement.

#### Step 2: Understand Identification Methods

```
Search for schemas related to "identification" in CPO role
```

Key schemas:
- **Identification**: Base identification structure
- **RFIDIdentification**: RFID card authentication
- **QRCodeIdentification**: QR code authentication
- **PlugAndChargeIdentification**: ISO 15118 authentication
- **RemoteIdentification**: App-based authentication

#### Step 3: Implement AuthorizeStart

```
Get details for eRoamingAuthorizeStart operation in CPO role
```

Request includes:
- Operator ID
- EVSE ID
- Identification (user credentials)
- Session ID (optional)
- Partner Product ID (optional)

Response includes:
- Authorization status (Authorized/NotAuthorized)
- Status code
- Session ID
- Provider ID

#### Step 4: Implement AuthorizeStop

```
Get details for eRoamingAuthorizeStop operation in CPO role
```

Request includes:
- Operator ID
- EVSE ID
- Session ID
- Identification
- Charging duration and energy

### Example Query Flow

```
1. "Show me the eRoamingAuthorizeStart operation for CPO"
2. "What identification methods are supported?"
3. "What is the structure of RFIDIdentification?"
4. "What status codes can be returned in authorization responses?"
```

### Best Practices

- Validate identification credentials against Hubject's authorization data
- Return authorization response within 5 seconds
- Include clear status codes for rejection reasons
- Generate unique session IDs for tracking
- Support multiple identification methods
- Implement offline authorization fallback
- Log all authorization attempts for auditing

---

## Workflow 4: Charging Notifications

### Purpose
Report charging session progress and completion to Hubject and the EMP.

### When to Use
- When a charging session starts
- During charging (progress updates)
- When a charging session ends
- When errors occur during charging

### Operations

**Notification Types**:
- `eRoamingChargingNotificationStart` - Session started
- `eRoamingChargingNotificationProgress` - Ongoing session update
- `eRoamingChargingNotificationEnd` - Session completed
- `eRoamingChargingNotificationError` - Error occurred

### Step-by-Step Implementation

#### Step 1: Understand Notification Types

```
Get all operations in eRoamingChargingNotifications service for CPO
```

#### Step 2: Implement Start Notification

```
Get details for eRoamingChargingNotificationStart operation in CPO
```

Send when charging begins:
- Session ID
- EVSE ID
- Identification
- Start timestamp
- Session start information

#### Step 3: Implement Progress Notifications

```
Get details for eRoamingChargingNotificationProgress operation in CPO
```

Send periodically during charging:
- Session ID
- Current energy delivered
- Current charging duration
- Meter readings
- Timestamp

#### Step 4: Implement End Notification

```
Get details for eRoamingChargingNotificationEnd operation in CPO
```

Send when charging completes:
- Session ID
- Total energy delivered
- Total charging duration
- Final meter readings
- End timestamp
- Charging costs (if available)

#### Step 5: Implement Error Notification

```
Get details for eRoamingChargingNotificationError operation in CPO
```

Send when errors occur:
- Session ID
- Error type
- Error description
- Timestamp

### Example Query Flow

```
1. "Show me all charging notification operations for CPO"
2. "What data is required in ChargingNotificationStart?"
3. "How often should I send progress notifications?"
4. "What error types are defined in the protocol?"
```

### Best Practices

- Send start notification immediately when charging begins
- Send progress notifications every 5-15 minutes
- Send end notification within 1 minute of session completion
- Include accurate meter readings
- Send error notifications immediately when issues occur
- Ensure session IDs match across all notifications
- Include all required fields for billing accuracy
- Retry failed notifications with exponential backoff

---

## Workflow 5: Handling Reservations

### Purpose
Process reservation requests from EMPs for future charging sessions.

### Operations

- `eRoamingAuthorizeRemoteReservationStart` - Create reservation
- `eRoamingAuthorizeRemoteReservationStop` - Cancel reservation

### Step-by-Step Implementation

#### Step 1: Understand Reservation Operations

```
Get all operations in eRoamingReservation service for CPO
```

#### Step 2: Implement Reservation Start

```
Get details for eRoamingAuthorizeRemoteReservationStart in CPO
```

Handle reservation requests:
- Validate EVSE availability
- Check identification credentials
- Reserve the charging point
- Return reservation confirmation

#### Step 3: Implement Reservation Stop

```
Get details for eRoamingAuthorizeRemoteReservationStop in CPO
```

Handle cancellation requests:
- Validate session ID
- Release the reserved charging point
- Return cancellation confirmation

### Best Practices

- Validate EVSE is available before accepting reservation
- Set reasonable reservation timeout periods
- Release reservations automatically after timeout
- Support reservation cancellation
- Update EVSE status to "Reserved" during active reservations
- Notify when reserved user arrives

---

## Common CPO Integration Patterns

### Initial Setup Sequence

1. Push full EVSE data (fullLoad)
2. Push initial EVSE status (fullLoad)
3. Begin real-time status updates
4. Start handling authorization requests

### Daily Operations

1. Morning: Full EVSE data sync (fullLoad)
2. Continuous: Real-time status updates
3. Continuous: Authorization handling
4. Continuous: Charging notifications
5. Evening: Status verification sync

### Error Handling

- Implement retry logic for failed pushes
- Log all API interactions
- Monitor response status codes
- Handle network timeouts gracefully
- Maintain local queue for offline scenarios

### Testing Your Integration

```
1. "Show me example request for eRoamingPushEvseData"
2. "What are common error codes in authorization responses?"
3. "How do I validate my EVSE ID format?"
4. "What fields are mandatory in ChargingNotificationEnd?"
```

---

## Additional Resources

- See [getting-started.md](./getting-started.md) for basic OICP concepts
- See [emp-workflows.md](./emp-workflows.md) for EMP perspective
- Access full CPO OpenAPI spec: `oicp://cpo/spec`
- View CPO HTML documentation: `oicp://cpo/docs`

## Quick Reference

### Key CPO Operations

| Operation | Service | Purpose |
|-----------|---------|---------|
| eRoamingPushEvseData | eRoamingData | Share station information |
| eRoamingPushEvseStatus | eRoamingEvseStatus | Update availability |
| eRoamingAuthorizeStart | eRoamingAuthorization | Authorize session start |
| eRoamingAuthorizeStop | eRoamingAuthorization | Authorize session end |
| eRoamingChargingNotificationStart | eRoamingChargingNotifications | Report session start |
| eRoamingChargingNotificationEnd | eRoamingChargingNotifications | Report session end |

### Tool Usage Patterns

- **Explore**: `list_services` → `get_operations_by_tag`
- **Implement**: `get_operation_details` → `get_data_schema`
- **Validate**: `search_schemas` → check field requirements
- **Debug**: Review operation details and response codes
